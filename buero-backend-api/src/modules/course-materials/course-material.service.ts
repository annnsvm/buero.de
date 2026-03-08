import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

@Injectable()
export class CourseMaterialService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureCourseExists(courseId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException(`Курс з id ${courseId} не знайдено`);
    }
  }

  async findAllByCourseId(courseId: string) {
    try {
      await this.ensureCourseExists(courseId);
      return this.prisma.courseMaterial.findMany({
        where: { courseId },
        orderBy: { orderIndex: 'asc' },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async findOne(courseId: string, id: string) {
    try {
      await this.ensureCourseExists(courseId);
      const material = await this.prisma.courseMaterial.findFirst({
        where: { id, courseId },
      });
      if (!material) {
        throw new NotFoundException(
          `Матеріал з id ${id} не знайдено або не належить курсу`,
        );
      }
      return material;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.mapError(error);
    }
  }

  async create(courseId: string, dto: CreateCourseMaterialDto) {
    try {
      await this.ensureCourseExists(courseId);
      return this.prisma.courseMaterial.create({
        data: {
          courseId,
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

  async update(courseId: string, id: string, dto: UpdateCourseMaterialDto) {
    try {
      await this.findOne(courseId, id);
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

  async delete(courseId: string, id: string) {
    try {
      await this.findOne(courseId, id);
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new BadRequestException(message);
  }
}
