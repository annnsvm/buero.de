import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';

@Injectable()
export class CourseModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCanAccessCourse(
    userId: string,
    role: Role,
    courseId: string,
  ): Promise<void> {
    await this.ensureCourseExists(courseId);
    if (role === Role.teacher) return;
    const access = await this.prisma.userCourseAccess.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!access) {
      throw new ForbiddenException('Немає доступу до цього курсу');
    }
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

  async findAllByCourseId(courseId: string) {
    try {
      await this.ensureCourseExists(courseId);
      return this.prisma.courseModule.findMany({
        where: { courseId },
        orderBy: { orderIndex: 'asc' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async findOne(courseId: string, moduleId: string) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      return this.prisma.courseModule.findUniqueOrThrow({
        where: { id: moduleId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async create(courseId: string, dto: CreateCourseModuleDto) {
    try {
      await this.ensureCourseExists(courseId);
      return this.prisma.courseModule.create({
        data: {
          courseId,
          title: dto.title,
          orderIndex: dto.order_index,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async update(courseId: string, moduleId: string, dto: UpdateCourseModuleDto) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      return this.prisma.courseModule.update({
        where: { id: moduleId },
        data: {
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.order_index !== undefined && { orderIndex: dto.order_index }),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async delete(courseId: string, moduleId: string) {
    try {
      await this.ensureModuleBelongsToCourse(moduleId, courseId);
      await this.prisma.courseModule.delete({
        where: { id: moduleId },
      });
      return { deleted: true, id: moduleId };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new BadRequestException(message);
  }
}
