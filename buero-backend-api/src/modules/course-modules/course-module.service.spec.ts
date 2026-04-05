import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CourseModuleService } from "./course-module.service";

describe("CourseModuleService", () => {
  let service: CourseModuleService;
  let prisma: {
    course: { findUnique: jest.Mock };
    courseModule: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUniqueOrThrow: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    userCourseAccess: { findUnique: jest.Mock };
  };

  const courseId = "cccccccc-cccc-cccc-cccc-cccccccccccc";
  const moduleId = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";

  beforeEach(async () => {
    prisma = {
      course: { findUnique: jest.fn() },
      courseModule: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userCourseAccess: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseModuleService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(CourseModuleService);
  });

  describe("assertCanAccessCourse", () => {
    it("throws NotFound when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.assertCanAccessCourse("u1", Role.teacher, courseId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("allows teacher without access row", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      await expect(
        service.assertCanAccessCourse("u1", Role.teacher, courseId),
      ).resolves.toBeUndefined();
    });

    it("forbids student without access", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue(null);
      await expect(
        service.assertCanAccessCourse("u1", Role.student, courseId),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("findAllByCourseId", () => {
    it("throws when course not found", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.findAllByCourseId(courseId, "u1", Role.teacher),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("returns all modules for teacher", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.courseModule.findMany.mockResolvedValue([
        { id: moduleId, courseId, title: "M1", orderIndex: 0 },
      ]);

      const list = await service.findAllByCourseId(
        courseId,
        "u1",
        Role.teacher,
      );
      expect(list).toHaveLength(1);
      expect(prisma.courseModule.findMany).toHaveBeenCalledWith({
        where: { courseId },
        orderBy: { orderIndex: "asc" },
      });
    });

    it("trial student sees only first module", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.userCourseAccess.findUnique.mockResolvedValue({
        accessType: "trial",
        trialEndsAt: new Date("2099-01-01"),
      });
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseModule.findMany.mockResolvedValue([
        { id: moduleId, courseId, title: "First", orderIndex: 0 },
      ]);

      const list = await service.findAllByCourseId(
        courseId,
        "stu",
        Role.student,
      );
      expect(list).toHaveLength(1);
      expect(prisma.courseModule.findMany).toHaveBeenCalledWith({
        where: { courseId, id: moduleId },
        orderBy: { orderIndex: "asc" },
      });
    });
  });

  describe("findOne", () => {
    it("throws when module not in course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.findOne(courseId, moduleId, "u1", Role.teacher),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("returns module for teacher", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseModule.findUniqueOrThrow.mockResolvedValue({
        id: moduleId,
        courseId,
        title: "M",
        orderIndex: 0,
      });

      const row = await service.findOne(courseId, moduleId, "u1", Role.teacher);
      expect(row.id).toBe(moduleId);
    });
  });

  describe("create", () => {
    it("throws when course missing", async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      await expect(
        service.create(courseId, { title: "A", order_index: 0 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("creates module in course", async () => {
      prisma.course.findUnique.mockResolvedValue({ id: courseId });
      prisma.courseModule.create.mockResolvedValue({
        id: moduleId,
        courseId,
        title: "A",
        orderIndex: 1,
      });

      const out = await service.create(courseId, {
        title: "A",
        order_index: 1,
      });
      expect(prisma.courseModule.create).toHaveBeenCalledWith({
        data: { courseId, title: "A", orderIndex: 1 },
      });
      expect(out.title).toBe("A");
    });
  });

  describe("update", () => {
    it("throws when module wrong course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(
        service.update(courseId, moduleId, { title: "X" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseModule.update.mockResolvedValue({
        id: moduleId,
        title: "New",
        orderIndex: 2,
      });

      await service.update(courseId, moduleId, {
        title: "New",
        order_index: 2,
      });
      expect(prisma.courseModule.update).toHaveBeenCalledWith({
        where: { id: moduleId },
        data: { title: "New", orderIndex: 2 },
      });
    });
  });

  describe("delete", () => {
    it("throws when module wrong course", async () => {
      prisma.courseModule.findFirst.mockResolvedValue(null);
      await expect(service.delete(courseId, moduleId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it("deletes module", async () => {
      prisma.courseModule.findFirst.mockResolvedValue({ id: moduleId });
      prisma.courseModule.delete.mockResolvedValue({});

      const out = await service.delete(courseId, moduleId);
      expect(out).toEqual({ deleted: true, id: moduleId });
      expect(prisma.courseModule.delete).toHaveBeenCalledWith({
        where: { id: moduleId },
      });
    });
  });
});
