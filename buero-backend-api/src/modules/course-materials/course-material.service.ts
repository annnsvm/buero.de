import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, UserCourseAccessType } from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

@Injectable()
export class CourseMaterialService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCanAccessCourse(
    userId: string,
    role: Role,
    courseId: string,
  ): Promise<void> {
    await this.ensureCourseExists(courseId);
    if (role === Role.teacher) return;
    const access = await this.prisma.userCourseAccess.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });
    if (!access) {
      throw new ForbiddenException('Немає доступу до цього курсу');
    }
    if (
      access.accessType === UserCourseAccessType.trial &&
      access.trialEndsAt &&
      access.trialEndsAt < new Date()
    ) {
      throw new ForbiddenException('Пробний період закінчився');
    }
  }

  /** Перевірка доступу до модуля (для матеріалів); при trial дозволений лише перший модуль. */
  async assertCanAccessModule(
    userId: string,
    role: Role,
    courseId: string,
    moduleId: string,
  ): Promise<void> {
    await this.ensureCourseExists(courseId);
    if (role === Role.teacher) return;
    const access = await this.prisma.userCourseAccess.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!access) {
      throw new ForbiddenException('Немає доступу до цього курсу');
    }
    if (access.accessType === UserCourseAccessType.trial) {
      const firstModuleId = await this.getFirstModuleId(courseId);
      if (firstModuleId !== null && moduleId !== firstModuleId) {
        throw new ForbiddenException(
          'На пробному періоді доступні лише матеріали першого модуля',
        );
      }
    }
  }

  private async getFirstModuleId(courseId: string): Promise<string | null> {
    const first = await this.prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
      select: { id: true },
    });
    return first?.id ?? null;
  }

  private async ensureCourseExists(courseId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Курс з id ${courseId} не знайдено`);
    }
  }

  private async ensureModuleBelongsToCourse(
    moduleId: string,
    courseId: string,
  ): Promise<void> {
    const module = await this.prisma.courseModule.findFirst({
      where: { id: moduleId, courseId },
    });
    if (!module) {
      throw new NotFoundException(
        `Модуль з id ${moduleId} не знайдено або не належить курсу`,
      );
    }
  }

  async findAllByModuleId(courseId: string, moduleId: string) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      return this.prisma.courseMaterial.findMany({
        where: { moduleId },
        orderBy: { orderIndex: 'asc' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async findOne(courseId: string, moduleId: string, id: string) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      const material = await this.prisma.courseMaterial.findFirst({
        where: { id, moduleId },
      });
      if (!material) {
        throw new NotFoundException(
          `Матеріал з id ${id} не знайдено або не належить модулю`,
        );
      }
      return material;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async create(
    courseId: string,
    moduleId: string,
    dto: CreateCourseMaterialDto,
  ) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      return this.prisma.courseMaterial.create({
        data: {
          moduleId,
          type: dto.type,
          title: dto.title,
          content: dto.content as object,
          orderIndex: dto.order_index,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async update(
    courseId: string,
    moduleId: string,
    id: string,
    dto: UpdateCourseMaterialDto,
  ) {
    try {
      await this.findOne(courseId, moduleId, id);
      return this.prisma.courseMaterial.update({
        where: { id },
        data: {
          ...(dto.type !== undefined && { type: dto.type }),
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.content !== undefined && { content: dto.content as object }),
          ...(dto.order_index !== undefined && { orderIndex: dto.order_index }),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async delete(courseId: string, moduleId: string, id: string) {
    try {
      await this.findOne(courseId, moduleId, id);
      await this.prisma.courseMaterial.delete({
        where: { id },
      });
      return { deleted: true, id };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    if (error instanceof ForbiddenException) throw error;
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new BadRequestException(message);
  }
}
