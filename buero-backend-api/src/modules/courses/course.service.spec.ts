import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Language, Level } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { StripeService } from "src/modules/stripe/stripe.service";
import { UserService } from "src/modules/user/user.service";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import {
  ListCoursesQueryDto,
  PublicationStatus,
} from "./dto/list-courses-query.dto";

const courseId = "c1000000-0000-0000-0000-000000000001";
const now = new Date("2026-01-01T12:00:00.000Z");

function baseCourseRow(overrides: Record<string, unknown> = {}) {
  return {
    id: courseId,
    teacherId: null,
    title: "Test Course",
    description: "Desc",
    language: Language.de,
    isPublished: true,
    price: { toString: () => "19.99" },
    tags: ["Language"],
    level: Level.A1,
    durationHours: 10,
    imageUrl: null,
    stripeProductId: null,
    stripePriceId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("CourseService", () => {
  let service: CourseService;
  let prisma: {
    course: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    courseModule: { findMany: jest.Mock };
    courseMaterial: { groupBy: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock };
  };
  let configGet: jest.Mock;
  let stripeService: {
    createProduct: jest.Mock;
    createPrice: jest.Mock;
  };

  beforeEach(async () => {
    configGet = jest.fn((key: string) => {
      if (key === "STRIPE_DEFAULT_CURRENCY") return "eur";
      return undefined;
    });

    prisma = {
      course: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
      },
      courseModule: { findMany: jest.fn().mockResolvedValue([]) },
      courseMaterial: { groupBy: jest.fn().mockResolvedValue([]) },
      userCourseAccess: { findUnique: jest.fn() },
    };

    stripeService = {
      createProduct: jest.fn().mockResolvedValue({ id: "prod_1" }),
      createPrice: jest.fn().mockResolvedValue({ id: "price_1" }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: ConfigService, useValue: { get: configGet } },
        {
          provide: UserService,
          useValue: { findUserById: jest.fn() },
        },
        {
          provide: CloudinaryService,
          useValue: { uploadImage: jest.fn() },
        },
        { provide: StripeService, useValue: stripeService },
      ],
    }).compile();

    service = module.get(CourseService);
  });

  describe("findAll", () => {
    it("каталог: лише опубліковані (isPublished true)", async () => {
      await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublished: true }),
        }),
      );
    });

    it("фільтр unpublished", async () => {
      await service.findAll(undefined, {
        publicationFilter: PublicationStatus.unpublished,
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublished: false }),
        }),
      );
    });

    it("publication all — без isPublished у where", async () => {
      await service.findAll(undefined, {
        publicationFilter: PublicationStatus.all,
      });
      const call = prisma.course.findMany.mock.calls[0][0];
      expect(call.where.isPublished).toBeUndefined();
    });

    it("language, level, search, tags", async () => {
      const filters: ListCoursesQueryDto = {
        language: Language.en,
        level: Level.B1,
        search: "  hello  ",
        tags: "A,B",
      };
      await service.findAll(filters, {
        publicationFilter: PublicationStatus.published,
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isPublished: true,
            language: Language.en,
            level: Level.B1,
            tags: { hasSome: ["A", "B"] },
            OR: [
              { title: { contains: "hello", mode: "insensitive" } },
              { description: { contains: "hello", mode: "insensitive" } },
            ],
          }),
        }),
      );
    });

    it("додає videoLessonCount з groupBy", async () => {
      const row = baseCourseRow({ id: "c2" });
      prisma.course.findMany.mockResolvedValue([row]);
      prisma.courseModule.findMany.mockResolvedValue([
        { id: "m1", courseId: "c2" },
      ]);
      prisma.courseMaterial.groupBy.mockResolvedValue([
        { moduleId: "m1", _count: { _all: 2 } },
      ]);

      const result = await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(result).toHaveLength(1);
      expect(result[0].videoLessonCount).toBe(2);
    });
  });

  describe("findById", () => {
    it("404 якщо курс відсутній", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.findById(courseId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("повертає серіалізований курс без userId", async () => {
      const course = {
        ...baseCourseRow(),
        modules: [],
      };
      prisma.course.findUnique.mockResolvedValue(course);

      const out = await service.findById(courseId, true, undefined);
      expect(out).toMatchObject({
        id: courseId,
        title: "Test Course",
        price: 19.99,
        image_url: null,
      });
      expect(prisma.userCourseAccess.findUnique).not.toHaveBeenCalled();
    });

    it("з userId і доступом — my_access", async () => {
      const modId = "m1000000-0000-0000-0000-000000000001";
      prisma.course.findUnique.mockResolvedValue({
        ...baseCourseRow(),
        modules: [
          {
            id: modId,
            courseId,
            title: "M1",
            orderIndex: 0,
            materials: [],
            createdAt: now,
            updatedAt: now,
          },
        ],
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        userId: "u1",
        courseId,
        accessType: "trial",
        trialEndsAt: new Date("2026-12-31"),
      });

      const out = await service.findById(courseId, true, "u1");
      expect(out).toMatchObject({
        my_access: expect.objectContaining({
          access_type: "trial",
          first_module_id: modId,
        }),
      });
    });
  });

  describe("create", () => {
    it("створює курс через prisma.create", async () => {
      const created = baseCourseRow({
        title: "New",
        isPublished: false,
        price: null,
        tags: [],
      });
      prisma.course.create.mockResolvedValue(created);

      const dto: CreateCourseDto = {
        title: "New",
        language: Language.de,
        description: "D",
        is_published: false,
        tags: [],
      };
      const out = await service.create(dto);
      expect(prisma.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "New",
          language: Language.de,
          description: "D",
          isPublished: false,
          tags: [],
        }),
      });
      expect(out).toMatchObject({ id: courseId, title: "New" });
    });
  });

  describe("update", () => {
    it("404 якщо курс не знайдено", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.update(courseId, { title: "X" })).rejects.toThrow(
        NotFoundException,
      );
    });

    it("оновлює поля без Stripe (вже опублікований)", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        title: "Old",
        price: { toString: () => "10" },
        stripeProductId: null,
        stripePriceId: null,
        isPublished: true,
      });
      const updated = baseCourseRow({ title: "New Title" });
      prisma.course.update.mockResolvedValue(updated);

      const out = await service.update(courseId, { title: "New Title" });
      expect(prisma.course.update).toHaveBeenCalled();
      expect(out.title).toBe("New Title");
      expect(stripeService.createProduct).not.toHaveBeenCalled();
    });

    it("перша публікація з ціною створює Stripe Product/Price", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: courseId,
        title: "Paid",
        price: null,
        stripeProductId: null,
        stripePriceId: null,
        isPublished: false,
      });
      prisma.course.update.mockResolvedValue(
        baseCourseRow({ isPublished: true, price: { toString: () => "15" } }),
      );

      await service.update(courseId, { is_published: true, price: 15 });

      expect(stripeService.createProduct).toHaveBeenCalled();
      expect(stripeService.createPrice).toHaveBeenCalled();
      expect(prisma.course.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            stripeProductId: "prod_1",
            stripePriceId: "price_1",
          }),
        }),
      );
    });
  });

  describe("delete", () => {
    it("видаляє після успішного findById", async () => {
      prisma.course.findUnique.mockResolvedValue({
        ...baseCourseRow(),
        modules: [],
      });

      const out = await service.delete(courseId);
      expect(out).toEqual({ deleted: true, id: courseId });
      expect(prisma.course.delete).toHaveBeenCalledWith({
        where: { id: courseId },
      });
    });

    it("404 якщо курс не існує", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.delete(courseId)).rejects.toThrow(NotFoundException);
      expect(prisma.course.delete).not.toHaveBeenCalled();
    });
  });

  describe("mapPrismaError", () => {
    it("findAll обгортає помилку Prisma у BadRequestException", async () => {
      prisma.course.findMany.mockRejectedValue(new Error("db fail"));
      await expect(
        service.findAll(undefined, {
          publicationFilter: PublicationStatus.published,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
