import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Language, Level } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { PaymentFulfillmentService } from "../subscriptions/payment-fulfillment.service";
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
      aggregate: jest.Mock;
    };
    courseModule: { findMany: jest.Mock };
    courseMaterial: { groupBy: jest.Mock; findMany: jest.Mock };
    materialAttachment: { findMany: jest.Mock };
    userCourseAccess: { findUnique: jest.Mock };
    $queryRaw: jest.Mock;
  };
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
        aggregate: jest.fn().mockResolvedValue({ _max: { orderIndex: null } }),
      },
      courseModule: { findMany: jest.fn().mockResolvedValue([]) },
      courseMaterial: { groupBy: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
      materialAttachment: { findMany: jest.fn().mockResolvedValue([]) },
      userCourseAccess: { findUnique: jest.fn() },
      $queryRaw: jest.fn().mockResolvedValue([]),
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
        {
          provide: PaymentFulfillmentService,
          useValue: { reconcilePendingForUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(CourseService);
    (
      service as unknown as { clearCourseCaches: () => void }
    ).clearCourseCaches();
  });

  describe("findAll", () => {
    beforeEach(() => {
      prisma.$queryRaw.mockResolvedValue([]);
      (
        service as unknown as { clearCourseCaches: () => void }
      ).clearCourseCaches();
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
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
      });
    });

    it("adds videoLessonCount from groupBy", async () => {
      prisma.course.findMany.mockResolvedValue([courseRow({ id: "c1" })]);
      prisma.$queryRaw.mockResolvedValue([
        { course_id: "c1", lessons: 3, videos: 3 },
      ]);

      const list = await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(list[0].videoLessonCount).toBe(3);
      expect(list[0].lessonsCount).toBe(3);
      expect(list[0].avgVideoLessonMinutes).toBeNull();
      expect((list[0] as unknown as { price: number }).price).toBeCloseTo(
        19.99,
        2,
      );
    });

    it("does not load video content JSON for catalog averages", async () => {
      prisma.course.findMany.mockResolvedValue([courseRow({ id: "c1" })]);
      prisma.$queryRaw.mockResolvedValue([
        { course_id: "c1", lessons: 2, videos: 2 },
      ]);

      const list = await service.findAll(undefined, {
        publicationFilter: PublicationStatus.published,
      });
      expect(prisma.courseMaterial.findMany).not.toHaveBeenCalled();
      expect(list[0].avgVideoLessonMinutes).toBeNull();
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
      prisma.course.findUnique.mockResolvedValue(courseRow());
      prisma.courseModule.findMany.mockResolvedValue([]);
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
      prisma.course.findUnique.mockResolvedValue(courseRow());
      prisma.courseModule.findMany.mockResolvedValue([
        { id: modId, orderIndex: 0 },
      ]);
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

    it("updates fields of an already published course", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: "c1",
        title: "Old",
        price: { toString: () => "10" },
        isPublished: true,
      });
      prisma.course.update.mockResolvedValue(
        courseRow({ title: "Updated", isPublished: true }),
      );

      const out = await service.update("c1", { title: "Updated" });

      expect(out.title).toBe("Updated");
    });

    it("publishes a course with a price without any external calls", async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: "c1",
        title: "Sell me",
        price: null,
        isPublished: false,
      });
      prisma.course.update.mockResolvedValue(
        courseRow({ isPublished: true, price: { toString: () => "25" } }),
      );

      const out = await service.update("c1", { is_published: true, price: 25 });

      expect(prisma.course.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "c1" },
          data: expect.objectContaining({ isPublished: true, price: 25 }),
        }),
      );
      expect(out.price).toBe(25);
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
