import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  CourseMaterialType,
  Language,
  Level,
  Role,
  UserCourseAccessType,
} from "../../generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { StripeService } from "../stripe/stripe.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import {
  ListCoursesQueryDto,
  PublicationStatus,
} from "./dto/list-courses-query.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { ReorderCoursesDto } from "./dto/reorder-courses.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly stripeService: StripeService
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
      const lessonsByCourse = await this.countMaterialsByCourseIds(courseIds);
      return active.map((a) => ({
        ...this.serializeCourse(a.course as Record<string, unknown>),
        videoLessonCount: videoByCourse.get(a.courseId) ?? 0,
        lessonsCount: lessonsByCourse.get(a.courseId) ?? 0,
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

  async findAll(
    filters?: ListCoursesQueryDto,
    opts?: { publicationFilter?: PublicationStatus },
  ) {
    try {
      const pubFilter = opts?.publicationFilter ?? PublicationStatus.published;
      const where: {
        isPublished?: boolean;
        language?: Language;
        tags?: { hasSome: string[] };
        level?: Level;
        OR?: Array<
          | { title: { contains: string; mode: "insensitive" } }
          | { description: { contains: string; mode: "insensitive" } }
        >;
      } = {};
      if (pubFilter === PublicationStatus.published) where.isPublished = true;
      else if (pubFilter === PublicationStatus.unpublished)
        where.isPublished = false;
      if (filters?.language) where.language = filters.language;
      if (filters?.level) where.level = filters.level;
      const searchTrim = filters?.search?.trim();
      if (searchTrim) {
        where.OR = [
          { title: { contains: searchTrim, mode: "insensitive" } },
          { description: { contains: searchTrim, mode: "insensitive" } },
        ];
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
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
      });
      const videoByCourse = await this.countVideoMaterialsByCourseIds(
        courses.map((c) => c.id)
      );
      const lessonsByCourse = await this.countMaterialsByCourseIds(
        courses.map((c) => c.id)
      );
      return courses.map((c) => ({
        ...this.serializeCourse(c as Record<string, unknown>),
        videoLessonCount: videoByCourse.get(c.id) ?? 0,
        lessonsCount: lessonsByCourse.get(c.id) ?? 0,
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
      const maxOrder = await this.prisma.course.aggregate({
        _max: { orderIndex: true },
      });
      const nextOrderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

      const course = await this.prisma.course.create({
        data: {
          title: dto.title,
          description: dto.description ?? null,
          language: dto.language,
          isPublished: dto.is_published ?? false,
          orderIndex: nextOrderIndex,
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

  async reorderCourses(dto: ReorderCoursesDto) {
    try {
      const ids = dto.items.map((item) => item.id);
      const existingCount = await this.prisma.course.count({
        where: { id: { in: ids } },
      });
      if (existingCount !== ids.length) {
        throw new NotFoundException("Один або кілька курсів не знайдено");
      }

      await this.prisma.$transaction(
        dto.items.map((item) =>
          this.prisma.course.update({
            where: { id: item.id },
            data: { orderIndex: item.order_index },
          }),
        ),
      );

      return { updated: dto.items.length };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapPrismaError(error);
    }
  }

  async update(id: string, dto: UpdateCourseDto) {
    try {
      const existing = await this.prisma.course.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          price: true,
          stripeProductId: true,
          stripePriceId: true,
          isPublished: true,
        },
      });
      if (!existing) {
        throw new NotFoundException(`Курс з id ${id} не знайдено`);
      }

      const updateData: Record<string, unknown> = {
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
      };

      const isPublishing =
        dto.is_published === true && existing.isPublished === false;
      if (isPublishing) {
        const effectivePriceRaw =
          dto.price !== undefined
            ? Number(dto.price)
            : this.priceToNumber(existing.price);
        const effectivePrice =
          effectivePriceRaw != null && Number.isFinite(effectivePriceRaw)
            ? effectivePriceRaw
            : null;
        if (
          effectivePrice !== null &&
          effectivePrice > 0 &&
          !existing.stripePriceId
        ) {
          try {
            const product = await this.stripeService.createProduct({
              name: (dto.title ?? existing.title).slice(0, 255),
            });
            const unitAmountCents = Math.round(effectivePrice * 100);
            const currency =
              this.configService.get<string>("STRIPE_DEFAULT_CURRENCY") ??
              "eur";
            const price = await this.stripeService.createPrice({
              productId: product.id,
              unitAmountCents,
              currency,
            });
            updateData.stripeProductId = product.id;
            updateData.stripePriceId = price.id;
            this.logger.log(
              `Stripe Product+Price created for course ${id}: product=${product.id}, price=${price.id}`
            );
          } catch (stripeErr) {
            const msg =
              stripeErr instanceof Error
                ? stripeErr.message
                : String(stripeErr);
            this.logger.error(
              `Stripe Product/Price creation failed for course ${id}: ${msg}`,
              stripeErr instanceof Error ? stripeErr.stack : undefined
            );
            throw new BadRequestException(
              `Не вдалося створити ціну в Stripe: ${msg}. Перевірте логи.`
            );
          }
        } else if (effectivePrice === null || effectivePrice <= 0) {
          this.logger.log(
            `Course ${id} published without price (free course), skipping Stripe Product/Price`
          );
        }
      }

      const course = await this.prisma.course.update({
        where: { id },
        data: updateData as Parameters<
          typeof this.prisma.course.update
        >[0]["data"],
      });
      return this.serializeCourse(course as Record<string, unknown>);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      this.logger.error(
        `Course update failed for id ${id}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw this.mapPrismaError(error);
    }
  }

  /** Конвертує Prisma Decimal price в number */
  private priceToNumber(price: unknown): number | null {
    if (price == null) return null;
    if (typeof price === "number" && Number.isFinite(price)) return price;
    if (typeof price === "object" && "toString" in price) {
      const n = Number((price as { toString: () => string }).toString());
      return Number.isFinite(n) ? n : null;
    }
    return null;
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

  /**
   * Завантажує обкладинку в Cloudinary і зберігає secure_url у courses.image_url.
   */
  async uploadCover(courseId: string, file: Express.Multer.File) {
    try {
      await this.findById(courseId, false);

      const secureUrl = await this.cloudinaryService.uploadImage(file.buffer, {
        folder: "courses",
        publicId: courseId,
      });

      const course = await this.prisma.course.update({
        where: { id: courseId },
        data: { imageUrl: secureUrl },
      });
      return this.serializeCourse(course as Record<string, unknown>);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw error;
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

      const lessonsCount = await this.getCourseMaterialsCount(courseId);
      if (lessonsCount < 1) {
        throw new BadRequestException(
          "Курс ще не містить уроків і недоступний для trial",
        );
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
    return this.countMaterialsByCourseIds(courseIds, CourseMaterialType.video);
  }

  /** Усі матеріали (або лише обраний type) по курсах — для lessonsCount та «coming soon». */
  private async countMaterialsByCourseIds(
    courseIds: string[],
    type?: CourseMaterialType,
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
        moduleId: { in: moduleIds },
        ...(type ? { type } : {}),
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

  private async getCourseMaterialsCount(courseId: string): Promise<number> {
    return this.prisma.courseMaterial.count({
      where: { module: { courseId } },
    });
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
    const { imageUrl, ...rest } = course as T & {
      imageUrl?: string | null;
    };
    return {
      ...rest,
      price: priceAsNumber,
      image_url: imageUrl ?? null,
    } as unknown as T;
  }

  private mapPrismaError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new BadRequestException(message);
  }
}
