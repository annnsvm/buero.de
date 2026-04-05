import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Language, Level } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { StripeService } from "../stripe/stripe.service";
import { UserService } from "../user/user.service";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import {
  ListCoursesQueryDto,
  PublicationStatus,
} from "./dto/list-courses-query.dto";

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
  let stripeService: { createProduct: jest.Mock; createPrice: jest.Mock };

  const courseRow = (over: Record<string, unknown> = {}) => ({
    id: "course-1",
    teacherId: null,
    title: "Test Course",
    description: "Desc",
    language: "en",
    isPublished: true,
    price: { toString: () => "19.99" },
    tags: ["Language"],
    level: "A1",
    durationHours: 10,
    imageUrl: null,
    stripeProductId: null,
    stripePriceId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...over,
  });

  beforeEach(async () => {
    prisma = {
      course: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      courseModule: { findMany: jest.fn() },
      courseMaterial: { groupBy: jest.fn() },
      userCourseAccess: { findUnique: jest.fn() },
    };
    stripeService = {
      createProduct: jest.fn().mockResolvedValue({ id: "prod_x" }),
      createPrice: jest.fn().mockResolvedValue({ id: "price_x" }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        { provide: ConfigService, useValue: { get: jest.fn(() => "eur") } },
        { provide: UserService, useValue: { findUserById: jest.fn() } },
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
    beforeEach(() => {
      prisma.courseModule.findMany.mockResolvedValue([]);
      prisma.courseMaterial.groupBy.mockResolvedValue([]);
    });

    it("filters published only by default (catalog)", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublished: true }),
        }),
      );
    });

    it("filters unpublished when requested", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      await service.findAll(undefined, {
        publicationFilter: PublicationStatus.unpublished,
      });
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isPublished: false }),
        }),
      );
    });

    it("does not set isPublished when publicationFilter is all", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      await service.findAll(undefined, { publicationFilter: PublicationStatus.all });
      const arg = prisma.course.findMany.mock.calls[0][0];
      expect(arg.where.isPublished).toBeUndefined();
    });

    it("applies search, language, level, tags", async () => {
      prisma.course.findMany.mockResolvedValue([]);
      const q: ListCoursesQueryDto = {
        search: "  German  ",
        language: Language.de,
        level: Level.B1,
        tags: "A, B",
      };
      await service.findAll(q, { publicationFilter: PublicationStatus.all });
      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: {
          language: Language.de,
          level: Level.B1,
          OR: [
            { title: { contains: "German", mode: "insensitive" } },
            { description: { contains: "German", mode: "insensitive" } },
          ],
          tags: { hasSome: ["A", "B"] },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("adds videoLessonCount from groupBy", async () => {
      prisma.course.findMany.mockResolvedValue([courseRow({ id: "c1" })]);
      prisma.courseModule.findMany.mockResolvedValue([
        { id: "m1", courseId: "c1" },
      ]);
      prisma.courseMaterial.groupBy.mockResolvedValue([
        { moduleId: "m1", _count: { _all: 3 } },
      ]);

      const list = await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(list[0].videoLessonCount).toBe(3);
      expect((list[0] as unknown as { price: number }).price).toBeCloseTo(
        19.99,
        2,
      );
    });
  });

  describe("findById", () => {
    it("throws NotFoundException when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.findById("missing")).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("returns serialized course with modules when no userId", async () => {
      prisma.course.findUnique.mockResolvedValue({
        ...courseRow(),
        modules: [],
      });
      const result = await service.findById("course-1", true);
      expect(result).toMatchObject({
        id: "course-1",
        title: "Test Course",
        image_url: null,
      });
      expect((result as { modules?: unknown }).modules).toEqual([]);
    });

    it("adds my_access when user has course access", async () => {
      const modId = "mod-first";
      prisma.course.findUnique.mockResolvedValue({
        ...courseRow(),
        modules: [{ id: modId, orderIndex: 0 }],
      });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });

      const result = await service.findById("course-1", true, "user-1");
      expect(result).toMatchObject({
        my_access: expect.objectContaining({
          access_type: "trial",
          first_module_id: modId,
        }),
      });
    });
  });

  describe("create", () => {
    it("creates course and returns serialized row", async () => {
      prisma.course.create.mockResolvedValue(
        courseRow({ title: "New", price: null, isPublished: false }),
      );

      const dto: CreateCourseDto = {
        title: "New",
        language: Language.en,
        is_published: false,
      };
      const out = await service.create(dto);

      expect(prisma.course.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "New",
          language: Language.en,
          isPublished: false,
        }),
      });
      expect(out.title).toBe("New");
      expect(out.price).toBeNull();
    });
  });

  describe("update", () => {
    it("throws NotFoundException when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.update("x", { title: "y" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates fields without Stripe when not first publish with price", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: "c1",
        title: "Old",
        price: { toString: () => "10" },
        stripeProductId: null,
        stripePriceId: null,
        isPublished: true,
      });
      prisma.course.update.mockResolvedValue(
        courseRow({ title: "Updated", isPublished: true }),
      );

      const out = await service.update("c1", { title: "Updated" });
      expect(out.title).toBe("Updated");
      expect(stripeService.createProduct).not.toHaveBeenCalled();
    });

    it("creates Stripe product+price on first publish with positive price", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: "c1",
        title: "Sell me",
        price: null,
        stripeProductId: null,
        stripePriceId: null,
        isPublished: false,
      });
      prisma.course.update.mockResolvedValue(
        courseRow({
          isPublished: true,
          stripeProductId: "prod_x",
          stripePriceId: "price_x",
        }),
      );

      await service.update("c1", { is_published: true, price: 25 });

      expect(stripeService.createProduct).toHaveBeenCalled();
      expect(stripeService.createPrice).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: "prod_x",
          unitAmountCents: 2500,
        }),
      );
    });
  });

  describe("delete", () => {
    it("throws when course not found", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(service.delete("nope")).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(prisma.course.delete).not.toHaveBeenCalled();
    });

    it("deletes after findById succeeds", async () => {
      prisma.course.findUnique.mockResolvedValue({ ...courseRow(), modules: [] });
      prisma.course.delete.mockResolvedValue({});

      const out = await service.delete("course-1");
      expect(out).toEqual({ deleted: true, id: "course-1" });
      expect(prisma.course.delete).toHaveBeenCalledWith({
        where: { id: "course-1" },
      });
    });
  });

  describe("mapPrismaError", () => {
    it("wraps unknown errors as BadRequestException", async () => {
      prisma.course.findMany.mockRejectedValue(new Error("db down"));
      await expect(
        service.findAll(undefined, { publicationFilter: PublicationStatus.all }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
