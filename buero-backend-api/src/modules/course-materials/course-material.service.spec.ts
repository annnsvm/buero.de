import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CourseMaterialType, Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseMaterialService } from "./course-material.service";

describe("CourseMaterialService", () => {
  let service: CourseMaterialService;
  let prisma: {
    course: { findUnique: jest.Mock };
    courseModule: { findFirst: jest.Mock };
    courseMaterial: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    userCourseAccess: { findUnique: jest.Mock };
  };

  const courseId = "cccccccc-cccc-cccc-cccc-cccccccccccc";
  const moduleId = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";
  const materialId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

  beforeEach(async () => {
    prisma = {
      course: { findUnique: jest.fn() },
      courseModule: { findFirst: jest.fn() },
      courseMaterial: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userCourseAccess: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseMaterialService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(CourseMaterialService);
  });

  describe("courseId / moduleId validation", () => {
    it("findAllByModuleId throws when module not in course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.findAllByModuleId(courseId, moduleId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("findOne throws when material not in module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue(null);
      await expect(
        service.findOne(courseId, moduleId, materialId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("create throws when module belongs to another course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.create(courseId, moduleId, {
          type: CourseMaterialType.video,
          title: "L1",
          content: { youtube_video_id: "x" },
          order_index: 0,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("findAllByModuleId", () => {
    it("returns ordered materials", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findMany.mockResolvedValue([
        {
          id: materialId,
          moduleId,
          type: "video",
          title: "V1",
          content: {},
          orderIndex: 0,
        },
      ]);

      const list = await service.findAllByModuleId(courseId, moduleId);
      expect(list).toHaveLength(1);
      expect(prisma.courseMaterial.findMany).toHaveBeenCalledWith({
        where: { moduleId },
        orderBy: { orderIndex: "asc" },
      });
    });
  });

  describe("findOne", () => {
    it("returns material when found", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue({
        id: materialId,
        moduleId,
        type: "text",
        title: "T",
        content: {},
        orderIndex: 0,
      });

      const row = await service.findOne(courseId, moduleId, materialId);
      expect(row.id).toBe(materialId);
    });
  });

  describe("create", () => {
    it("creates material in module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.create.mockResolvedValue({
        id: materialId,
        moduleId,
        type: CourseMaterialType.video,
        title: "Intro",
        content: { youtube_video_id: "abc" },
        orderIndex: 0,
      });

      const dto = {
        type: CourseMaterialType.video,
        title: "Intro",
        content: { youtube_video_id: "abc" },
        order_index: 0,
      };
      const out = await service.create(courseId, moduleId, dto);
      expect(prisma.courseMaterial.create).toHaveBeenCalledWith({
        data: {
          moduleId,
          type: CourseMaterialType.video,
          title: "Intro",
          content: { youtube_video_id: "abc" },
          orderIndex: 0,
        },
      });
      expect(out.title).toBe("Intro");
    });
  });

  describe("update", () => {
    it("throws when material missing", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue(null);
      await expect(
        service.update(courseId, moduleId, materialId, { title: "x" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates material", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue({ id: materialId });
      prisma.courseMaterial.update.mockResolvedValue({
        id: materialId,
        title: "New title",
      });

      await service.update(courseId, moduleId, materialId, {
        title: "New title",
      });
      expect(prisma.courseMaterial.update).toHaveBeenCalledWith({
        where: { id: materialId },
        data: { title: "New title" },
      });
    });
  });

  describe("delete", () => {
    it("deletes after findOne", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseMaterial.findFirst.mockResolvedValue({ id: materialId });
      prisma.courseMaterial.delete.mockResolvedValue({});

      const out = await service.delete(courseId, moduleId, materialId);
      expect(out).toEqual({ deleted: true, id: materialId });
    });
  });

  describe("assertCanAccessModule", () => {
    it("forbids student on non-first module during trial", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });
      prisma.courseModule.findFirst.mockResolvedValue({ id: "first-mod" });

      await expect(
        service.assertCanAccessModule(
          "stu",
          Role.student,
          courseId,
          "second-mod",
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });
});
