import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CourseCategory, Language, Role, UserCourseAccessType } from "../../generated/prisma/enums";
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
  ) {
  }


  async findAll(filters?: ListCoursesQueryDto) {
    try {
      const where: {
        isPublished: boolean;
        category?: CourseCategory;
        language?: Language;
      } = {
        isPublished: true,
      };
      if (filters?.category) where.category = filters.category;
      if (filters?.language) where.language = filters.language;

      return this.prisma.course.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async findById(
    id: string,
    includeModules = true,
    userId?: string | null,
  ) {
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

      if (!userId) return course as any;

      const access = await this.prisma.userCourseAccess.findUnique({
        where: { userId_courseId: { userId, courseId: id } },
      });
      if (!access) return course as any;

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
        ...(access.accessType === "trial" && access.trialEndsAt && {
          trial_ends_at: access.trialEndsAt.toISOString(),
        }),
        ...(access.accessType === "trial" &&
          firstModuleId && { first_module_id: firstModuleId }),
      };

      return { ...course, my_access } as any;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  async create(dto: CreateCourseDto) {
    try {
      return this.prisma.course.create({
        data: {
          title: dto.title,
          description: dto.description ?? null,
          language: dto.language,
          category: dto.category,
          isPublished: dto.is_published ?? false,
        },
      });
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async update(id: string, dto: UpdateCourseDto) {
    try {
      await this.findById(id);
      return this.prisma.course.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.description !== undefined && {
            description: dto.description,
          }),
          ...(dto.language !== undefined && { language: dto.language }),
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.is_published !== undefined && {
            isPublished: dto.is_published,
          }),
        },
      });
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
      const trialDaysRaw = this.configService.get<string | number>("TRIAL_DAYS");
      const trialDays = trialDaysRaw != null ? Number(trialDaysRaw) : 7;
      if (!Number.isFinite(trialDays) || trialDays < 1) {
        throw new BadRequestException("TRIAL_DAYS має бути додатним числом");
      }

      const course = await this.findById(courseId);
      if (course.isPublished !== true) {
        throw new BadRequestException("Курс не опублікований");
      }

      const user = await this.userService.findUserById(userId);
      if (!user) throw new NotFoundException(`Користувач з id ${userId} не знайдено`);
      if (user.role !== Role.student) {
        throw new BadRequestException("Тільки студент може активувати trial");
      }

      const existingAccess = await this.prisma.userCourseAccess.findUnique({
        where: { userId_courseId: { userId, courseId } },
      });
      if (existingAccess) {
        throw new ConflictException(
          "У вас вже є доступ до цього курсу (trial, купівля або підписка)",
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

  private mapPrismaError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new BadRequestException(message);
  }
}
