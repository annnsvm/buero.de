import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CourseMaterialType,
  Language,
  Level,
  Role,
  UserCourseAccessType,
} from "../../generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { ListCoursesQueryDto } from "./dto/list-courses-query.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  /**
   * Курси, до яких у користувача є активний доступ (trial без прострочки, purchase, subscription).
   */
  async findMyAccessibleCourses(userId: string) {
    try {
      const accesses = await this.prisma.userCourseAccess.findMany({
        where: { userId },
        include: { course: true },
        orderBy: { createdAt: "desc" },
      });
      const now = new Date();
      const active = accesses.filter((a) => {
        if (a.accessType !== UserCourseAccessType.trial) return true;
        if (!a.trialEndsAt) return true;
        return a.trialEndsAt >= now;
      });
      const courseIds = active.map((a) => a.courseId);
      const videoByCourse =
        await this.countVideoMaterialsByCourseIds(courseIds);
      return active.map((a) => ({
        ...this.serializeCourse(a.course as Record<string, unknown>),
        videoLessonCount: videoByCourse.get(a.courseId) ?? 0,
        my_access: {
          access_type: a.accessType,
          ...(a.accessType === "trial" &&
            a.trialEndsAt && {
              trial_ends_at: a.trialEndsAt.toISOString(),
            }),
        },
      }));
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async findAll(filters?: ListCoursesQueryDto) {
    try {
      const where: {
        isPublished: boolean;
        language?: Language;
        tags?: { hasSome: string[] };
        level?: Level;
        title?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      } = {
        isPublished: true,
      };
      if (filters?.language) where.language = filters.language;
      if (filters?.level) where.level = filters.level;
      const titleTrim = filters?.title?.trim();
      if (titleTrim) {
        where.title = { contains: titleTrim, mode: "insensitive" };
      }
      const descTrim = filters?.description?.trim();
      if (descTrim) {
        where.description = { contains: descTrim, mode: "insensitive" };
      }
      if (filters?.tags) {
        const tagsArray = filters.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (tagsArray.length > 0) where.tags = { hasSome: tagsArray };
      }

      const courses = await this.prisma.course.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      const videoByCourse = await this.countVideoMaterialsByCourseIds(
        courses.map((c) => c.id)
      );
      return courses.map((c) => ({
        ...this.serializeCourse(c as Record<string, unknown>),
        videoLessonCount: videoByCourse.get(c.id) ?? 0,
      }));
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async findById(id: string, includeModules = true, userId?: string | null) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: includeModules
          ? {
              modules: {
                orderBy: { orderIndex: "asc" },
                include: {
                  materials: { orderBy: { orderIndex: "asc" } },
                },
              },
            }
          : undefined,
      });
      if (!course) {
        throw new NotFoundException(`Курс з id ${id} не знайдено`);
      }

      if (!userId)
        return this.serializeCourse(course as Record<string, unknown>) as any;

      const access = await this.prisma.userCourseAccess.findUnique({
        where: { userId_courseId: { userId, courseId: id } },
      });
      if (!access)
        return this.serializeCourse(course as Record<string, unknown>) as any;

      const firstModule =
        "modules" in course &&
        Array.isArray(course.modules) &&
        course.modules.length > 0
          ? course.modules[0]
          : null;
      const firstModuleId =
        firstModule && typeof firstModule === "object" && "id" in firstModule
          ? (firstModule as { id: string }).id
          : undefined;

      const my_access = {
        access_type: access.accessType,
        ...(access.accessType === "trial" &&
          access.trialEndsAt && {
            trial_ends_at: access.trialEndsAt.toISOString(),
          }),
        ...(access.accessType === "trial" &&
          firstModuleId && { first_module_id: firstModuleId }),
      };

      const serialized = this.serializeCourse(
        course as Record<string, unknown>
      );
      return { ...serialized, my_access } as any;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  async create(dto: CreateCourseDto) {
    try {
      const course = await this.prisma.course.create({
        data: {
          title: dto.title,
          description: dto.description ?? null,
          language: dto.language,
          isPublished: dto.is_published ?? false,
          ...(dto.price !== undefined && { price: dto.price }),
          tags: dto.tags ?? [],
          ...(dto.level !== undefined && { level: dto.level }),
          ...(dto.duration_hours !== undefined && {
            durationHours: dto.duration_hours,
          }),
        },
      });
      return this.serializeCourse(course as Record<string, unknown>);
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async update(id: string, dto: UpdateCourseDto) {
    try {
      await this.findById(id);
      const course = await this.prisma.course.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.language !== undefined && { language: dto.language }),
          ...(dto.is_published !== undefined && {
            isPublished: dto.is_published,
          }),
          ...(dto.price !== undefined && { price: dto.price }),
          ...(dto.tags !== undefined && { tags: dto.tags }),
          ...(dto.level !== undefined && { level: dto.level }),
          ...(dto.duration_hours !== undefined && {
            durationHours: dto.duration_hours,
          }),
        },
      });
      return this.serializeCourse(course as Record<string, unknown>);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  async delete(id: string) {
    try {
      await this.findById(id);
      await this.prisma.course.delete({
        where: { id },
      });
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  async startTrial(userId: string, courseId: string) {
    try {
      const trialDaysRaw = this.configService.get<string | number>(
        "TRIAL_DAYS"
      );
      const trialDays = trialDaysRaw != null ? Number(trialDaysRaw) : 7;
      if (!Number.isFinite(trialDays) || trialDays < 1) {
        throw new BadRequestException("TRIAL_DAYS має бути додатним числом");
      }

      const course = await this.findById(courseId);
      if (course.isPublished !== true) {
        throw new BadRequestException("Курс не опублікований");
      }

      const user = await this.userService.findUserById(userId);
      if (!user)
        throw new NotFoundException(`Користувач з id ${userId} не знайдено`);
      if (user.role !== Role.student) {
        throw new BadRequestException("Тільки студент може активувати trial");
      }

      const existingAccess = await this.prisma.userCourseAccess.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      if (existingAccess) {
        throw new ConflictException(
          "У вас вже є доступ до цього курсу (trial, купівля або підписка)"
        );
      }

      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

      await this.prisma.userCourseAccess.create({
        data: {
          userId,
          courseId,
          accessType: UserCourseAccessType.trial,
          trialEndsAt,
        },
      });

      return {
        course_id: courseId,
        access_type: "trial" as const,
        trial_ends_at: trialEndsAt.toISOString(),
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw this.mapPrismaError(error);
    }
  }

  /** Лише для каталогу: кількість матеріалів type=video по курсах (batch). */
  private async countVideoMaterialsByCourseIds(
    courseIds: string[]
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    if (courseIds.length === 0) return map;
    const modules = await this.prisma.courseModule.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true, courseId: true },
    });
    if (modules.length === 0) return map;
    const moduleIdToCourseId = new Map(
      modules.map((m) => [m.id, m.courseId] as const)
    );
    const moduleIds = modules.map((m) => m.id);
    const grouped = await this.prisma.courseMaterial.groupBy({
      by: ["moduleId"],
      where: {
        type: CourseMaterialType.video,
        moduleId: { in: moduleIds },
      },
      _count: { _all: true },
    });
    for (const row of grouped) {
      const courseId = moduleIdToCourseId.get(row.moduleId);
      if (!courseId) continue;
      map.set(courseId, (map.get(courseId) ?? 0) + row._count._all);
    }
    return map;
  }

  /** Перетворює Decimal price на number для JSON-відповіді */
  private serializeCourse<T extends Record<string, unknown>>(course: T): T {
    if (course == null || typeof course !== "object") return course;
    const price = course.price;
    const priceAsNumber =
      price != null && typeof price === "object" && "toString" in price
        ? Number((price as { toString: () => string }).toString())
        : price != null
          ? Number(price)
          : null;
    return { ...course, price: priceAsNumber } as T;
  }

  private mapPrismaError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new BadRequestException(message);
  }
}
