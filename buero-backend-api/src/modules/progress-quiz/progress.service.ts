import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProgress(userId: string) {
    const [progressRows, profile] = await Promise.all([
      this.prisma.courseProgress.findMany({
        where: { userId },
        include: {
          course: { select: { id: true, title: true } },
          courseMaterial: { select: { id: true } },
        },
      }),
      this.prisma.studentProfile.findUnique({
        where: { userId },
        select: { level: true },
      }),
    ]);
    const courseIds = [...new Set(progressRows.map((r) => r.courseId))];
    const moduleCounts = courseIds.length
      ? await this.prisma.courseModule.findMany({
          where: { courseId: { in: courseIds } },
          select: { courseId: true, _count: { select: { materials: true } } },
        })
      : [];

    const totalByCourse = new Map<string, number>();
    for (const m of moduleCounts) {
      totalByCourse.set(m.courseId, (totalByCourse.get(m.courseId) ?? 0) + m._count.materials);
    }

    const completedByCourse = new Map<string, { count: number; title: string }>();
    for (const p of progressRows) {
      if (!p.courseMaterialId) continue;
      const key = p.courseId;
      const prev = completedByCourse.get(key);
      const title = p.course.title;
      if (!prev) {
        completedByCourse.set(key, { count: 1, title });
      } else {
        prev.count += 1;
      }
    }

    const courseIdsSet = new Set(progressRows.map((r) => r.courseId));
    const courses = Array.from(courseIdsSet).map((courseId: string) => {
      const total = totalByCourse.get(courseId) ?? 0;
      const completed = completedByCourse.get(courseId)?.count ?? 0;
      const title = completedByCourse.get(courseId)?.title ?? '';
      const completion_percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        course_id: courseId,
        course_title: title,
        completion_percent,
        completed_materials_count: completed,
        total_materials_count: total,
      };
    });

    return {
      courses,
      level: profile?.level ?? null,
    };
  }

  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Курс з id ${courseId} не знайдено`);
    }

    const progressList = await this.prisma.courseProgress.findMany({
      where: { userId, courseId, courseMaterialId: { not: null } },
      include: {
        courseMaterial: { select: { id: true, moduleId: true } },
      },
      orderBy: { completedAt: 'desc' },
    });

    const completed_materials = progressList.map((p) => ({
      course_material_id: p.courseMaterialId!,
      module_id: p.courseMaterial?.moduleId,
      completed_at: p.completedAt.toISOString(),
      score: p.score != null ? Number(p.score) : null,
    }));

    return { completed_materials };
  }

  async completeMaterial(
    userId: string,
    courseId: string,
    moduleId: string,
    materialId: string,
    score?: number,
  ) {
    const material = await this.prisma.courseMaterial.findFirst({
      where: { id: materialId, moduleId },
      include: { module: { select: { courseId: true } } },
    });
    if (!material) {
      throw new NotFoundException(
        `Матеріал з id ${materialId} не знайдено або не належить модулю`,
      );
    }
    if (material.module.courseId !== courseId) {
      throw new BadRequestException(
        'Модуль не належить вказаному курсу',
      );
    }

    const completedAt = new Date();
    const data = {
      userId,
      courseId,
      courseMaterialId: materialId,
      completedAt,
      ...(score != null && { score }),
    };

    await this.prisma.courseProgress.upsert({
      where: {
        userId_courseId_courseMaterialId: {
          userId,
          courseId,
          courseMaterialId: materialId,
        },
      },
      create: data,
      update: { completedAt, ...(score != null && { score }) },
    });

    return {
      completed: true,
      course_material_id: materialId,
      completed_at: completedAt.toISOString(),
      score: score ?? null,
    };
  }

  async getRecommendedNext(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      select: { level: true },
    });
    const level = profile?.level ?? null;
    if (!level) {
      return null;
    }

    const completedCourseIds = await this.prisma.courseProgress
      .findMany({
        where: { userId },
        select: { courseId: true },
        distinct: ['courseId'],
      })
      .then((rows) => new Set(rows.map((r) => r.courseId)));

    const nextCourse = await this.prisma.course.findFirst({
      where: {
        isPublished: true,
        id: { notIn: Array.from(completedCourseIds) },
      },
      orderBy: { createdAt: 'asc' },
    });

    return nextCourse;
  }
}
