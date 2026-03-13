import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseCategory, Language } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ListCoursesQueryDto } from './dto/list-courses-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: ListCoursesQueryDto) {
    try {
      const where: { isPublished: boolean; category?: CourseCategory; language?: Language } = {
        isPublished: true,
      };
      if (filters?.category) where.category = filters.category;
      if (filters?.language) where.language = filters.language;

      return this.prisma.course.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw this.mapPrismaError(error);
    }
  }

  async findById(id: string, includeModules = true) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: includeModules
          ? {
              modules: {
                orderBy: { orderIndex: 'asc' },
                include: {
                  materials: { orderBy: { orderIndex: 'asc' } },
                },
              },
            }
          : undefined,
      });
      if (!course) {
        throw new NotFoundException(`Курс з id ${id} не знайдено`);
      }
      return course;
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
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.language !== undefined && { language: dto.language }),
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.is_published !== undefined && { isPublished: dto.is_published }),
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

  private mapPrismaError(error: unknown): never {
    if (error instanceof NotFoundException) throw error;
    if (error instanceof BadRequestException) throw error;
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new BadRequestException(message);
  }
}
