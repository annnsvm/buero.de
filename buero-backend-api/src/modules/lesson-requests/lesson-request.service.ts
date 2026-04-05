import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  LessonRequestStatus,
  Role,
} from "src/generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateLessonRequestDto } from "./dto/create-lesson-request.dto";

export type LessonRequestResponse = {
  id: string;
  student_id: string;
  teacher_id: string | null;
  preferred_time: string | null;
  message: string | null;
  status: LessonRequestStatus;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class LessonRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    role: Role,
    dto: CreateLessonRequestDto,
  ): Promise<LessonRequestResponse> {
    try {
      if (role !== Role.student) {
        throw new BadRequestException(
          "Створювати запит на заняття може лише студент",
        );
      }
      await this.ensureUserExists(userId);

      const row = await this.prisma.lessonRequest.create({
        data: {
          studentId: userId,
          preferredTime: dto.preferred_time,
          message: dto.message ?? null,
          status: LessonRequestStatus.pending,
        },
      });
      return this.serialize(row);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw this.mapError(error);
    }
  }

  async findMyRequests(
    userId: string,
    role: Role,
  ): Promise<LessonRequestResponse[]> {
    try {
      await this.ensureUserExists(userId);

      if (role === Role.student) {
        const rows = await this.prisma.lessonRequest.findMany({
          where: { studentId: userId },
          orderBy: { createdAt: "desc" },
        });
        return rows.map((r) => this.serialize(r));
      }

      if (role === Role.teacher) {
        const rows = await this.prisma.lessonRequest.findMany({
          where: {
            OR: [
              { status: LessonRequestStatus.pending },
              { teacherId: userId },
            ],
          },
          orderBy: { createdAt: "desc" },
        });
        return rows.map((r) => this.serialize(r));
      }

      throw new BadRequestException(`Непідтримувана роль: ${role}`);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw this.mapError(error);
    }
  }

  async accept(
    id: string,
    userId: string,
    role: Role,
  ): Promise<LessonRequestResponse> {
    try {
      if (role !== Role.teacher) {
        throw new BadRequestException("Приймати запити може лише вчитель");
      }
      await this.ensureUserExists(userId);

      const existing = await this.prisma.lessonRequest.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Запит з id ${id} не знайдено`);
      }
      if (existing.status !== LessonRequestStatus.pending) {
        throw new BadRequestException(
          "Можна прийняти лише запит у статусі pending",
        );
      }

      const row = await this.prisma.lessonRequest.update({
        where: { id },
        data: {
          teacherId: userId,
          status: LessonRequestStatus.accepted,
        },
      });
      return this.serialize(row);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw this.mapError(error);
    }
  }

  async reject(
    id: string,
    userId: string,
    role: Role,
  ): Promise<LessonRequestResponse> {
    try {
      if (role !== Role.teacher) {
        throw new BadRequestException("Відхиляти запити може лише вчитель");
      }
      await this.ensureUserExists(userId);

      const existing = await this.prisma.lessonRequest.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Запит з id ${id} не знайдено`);
      }
      if (existing.status !== LessonRequestStatus.pending) {
        throw new BadRequestException(
          "Можна відхилити лише запит у статусі pending",
        );
      }

      const row = await this.prisma.lessonRequest.update({
        where: { id },
        data: { status: LessonRequestStatus.rejected },
      });
      return this.serialize(row);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw this.mapError(error);
    }
  }

  async complete(
    id: string,
    userId: string,
    role: Role,
  ): Promise<LessonRequestResponse> {
    try {
      if (role !== Role.teacher) {
        throw new BadRequestException(
          "Позначати заняття завершеним може лише вчитель",
        );
      }
      await this.ensureUserExists(userId);

      const existing = await this.prisma.lessonRequest.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Запит з id ${id} не знайдено`);
      }
      if (existing.status !== LessonRequestStatus.accepted) {
        throw new BadRequestException(
          "Можна завершити лише прийнятий запит (accepted)",
        );
      }
      if (existing.teacherId !== userId) {
        throw new BadRequestException(
          "Лише призначений вчитель може виставити статус completed",
        );
      }

      const row = await this.prisma.lessonRequest.update({
        where: { id },
        data: { status: LessonRequestStatus.completed },
      });
      return this.serialize(row);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw this.mapError(error);
    }
  }

  async cancel(
    id: string,
    userId: string,
    role: Role,
  ): Promise<LessonRequestResponse> {
    try {
      if (role !== Role.teacher) {
        throw new BadRequestException("Скасовувати заняття може лише вчитель");
      }
      await this.ensureUserExists(userId);

      const existing = await this.prisma.lessonRequest.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Запит з id ${id} не знайдено`);
      }
      if (existing.status !== LessonRequestStatus.accepted) {
        throw new BadRequestException(
          "Скасувати можна лише прийнятий запит (accepted)",
        );
      }
      if (existing.teacherId !== userId) {
        throw new BadRequestException(
          "Лише призначений вчитель може скасувати заняття",
        );
      }

      const row = await this.prisma.lessonRequest.update({
        where: { id },
        data: { status: LessonRequestStatus.rejected },
      });
      return this.serialize(row);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw this.mapError(error);
    }
  }

  private async ensureUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException(`Користувач з id ${userId} не знайдено`);
    }
  }

  private serialize(row: {
    id: string;
    studentId: string;
    teacherId: string | null;
    preferredTime: string | null;
    message: string | null;
    status: LessonRequestStatus;
    createdAt: Date;
    updatedAt: Date;
  }): LessonRequestResponse {
    return {
      id: row.id,
      student_id: row.studentId,
      teacher_id: row.teacherId ?? null,
      preferred_time: row.preferredTime ?? null,
      message: row.message ?? null,
      status: row.status,
      created_at: row.createdAt.toISOString(),
      updated_at: row.updatedAt.toISOString(),
    };
  }

  private mapError(error: unknown): never {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new BadRequestException(message);
  }
}
