import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  LessonRequestStatus,
  Role,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonRequestDto } from './dto/create-lesson-request.dto';

export type LessonRequestResponse = {
  id: string;
  student_id: string;
  teacher_id: string | null;
  preferred_time: string | null;
  message: string | null;
  status: LessonRequestStatus;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class LessonRequestService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponse(row: {
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
      teacher_id: row.teacherId,
      preferred_time: row.preferredTime,
      message: row.message,
      status: row.status,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    };
  }

  private async getUserOrThrow(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private assertActorRoleMatchesDb(
    userRole: Role,
    declaredRole: Role,
  ): void {
    if (userRole !== declaredRole) {
      throw new BadRequestException(
        'Declared role does not match the user account role',
      );
    }
  }

  async create(
    userId: string,
    declaredRole: Role,
    dto: CreateLessonRequestDto,
  ): Promise<LessonRequestResponse> {
    try {
      const user = await this.getUserOrThrow(userId);
      this.assertActorRoleMatchesDb(user.role, declaredRole);
      if (declaredRole !== Role.student) {
        throw new BadRequestException('Only students can create lesson requests');
      }

      const created = await this.prisma.lessonRequest.create({
        data: {
          studentId: userId,
          preferredTime: dto.preferred_time,
          message: dto.message ?? null,
          status: LessonRequestStatus.pending,
        },
      });
      return this.toResponse(created);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async findMyRequests(
    userId: string,
    declaredRole: Role,
  ): Promise<LessonRequestResponse[]> {
    try {
      const user = await this.getUserOrThrow(userId);
      this.assertActorRoleMatchesDb(user.role, declaredRole);

      if (declaredRole === Role.student) {
        const rows = await this.prisma.lessonRequest.findMany({
          where: { studentId: userId },
          orderBy: { createdAt: 'desc' },
        });
        return rows.map((r) => this.toResponse(r));
      }

      const rows = await this.prisma.lessonRequest.findMany({
        where: {
          OR: [
            { status: LessonRequestStatus.pending },
            { teacherId: userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
      return rows.map((r) => this.toResponse(r));
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async accept(
    id: string,
    userId: string,
    declaredRole: Role,
  ): Promise<LessonRequestResponse> {
    try {
      const user = await this.getUserOrThrow(userId);
      this.assertActorRoleMatchesDb(user.role, declaredRole);
      if (declaredRole !== Role.teacher) {
        throw new BadRequestException('Only teachers can accept lesson requests');
      }

      const result = await this.prisma.lessonRequest.updateMany({
        where: {
          id,
          status: LessonRequestStatus.pending,
        },
        data: {
          teacherId: userId,
          status: LessonRequestStatus.accepted,
        },
      });

      if (result.count === 0) {
        const existing = await this.prisma.lessonRequest.findUnique({
          where: { id },
        });
        if (!existing) {
          throw new NotFoundException('Lesson request not found');
        }
        throw new BadRequestException(
          'Lesson request must be in pending status to accept',
        );
      }

      const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
        where: { id },
      });
      return this.toResponse(updated);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async reject(
    id: string,
    userId: string,
    declaredRole: Role,
  ): Promise<LessonRequestResponse> {
    try {
      const user = await this.getUserOrThrow(userId);
      this.assertActorRoleMatchesDb(user.role, declaredRole);
      if (declaredRole !== Role.teacher) {
        throw new BadRequestException('Only teachers can reject lesson requests');
      }

      const result = await this.prisma.lessonRequest.updateMany({
        where: {
          id,
          status: LessonRequestStatus.pending,
        },
        data: {
          status: LessonRequestStatus.rejected,
        },
      });

      if (result.count === 0) {
        const existing = await this.prisma.lessonRequest.findUnique({
          where: { id },
        });
        if (!existing) {
          throw new NotFoundException('Lesson request not found');
        }
        throw new BadRequestException(
          'Lesson request must be in pending status to reject',
        );
      }

      const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
        where: { id },
      });
      return this.toResponse(updated);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async complete(
    id: string,
    userId: string,
    declaredRole: Role,
  ): Promise<LessonRequestResponse> {
    try {
      const user = await this.getUserOrThrow(userId);
      this.assertActorRoleMatchesDb(user.role, declaredRole);
      if (declaredRole !== Role.teacher) {
        throw new BadRequestException(
          'Only teachers can mark lesson requests as completed',
        );
      }

      const result = await this.prisma.lessonRequest.updateMany({
        where: {
          id,
          status: LessonRequestStatus.accepted,
          teacherId: userId,
        },
        data: {
          status: LessonRequestStatus.completed,
        },
      });

      if (result.count === 0) {
        const existing = await this.prisma.lessonRequest.findUnique({
          where: { id },
        });
        if (!existing) {
          throw new NotFoundException('Lesson request not found');
        }
        throw new BadRequestException(
          'Lesson request must be accepted and assigned to you to complete',
        );
      }

      const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
        where: { id },
      });
      return this.toResponse(updated);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async cancel(
    id: string,
    userId: string,
    declaredRole: Role,
  ): Promise<LessonRequestResponse> {
    try {
      const user = await this.getUserOrThrow(userId);
      this.assertActorRoleMatchesDb(user.role, declaredRole);
      if (declaredRole !== Role.teacher) {
        throw new BadRequestException(
          'Only teachers can cancel accepted lesson requests',
        );
      }

      const result = await this.prisma.lessonRequest.updateMany({
        where: {
          id,
          status: LessonRequestStatus.accepted,
          teacherId: userId,
        },
        data: {
          status: LessonRequestStatus.rejected,
        },
      });

      if (result.count === 0) {
        const existing = await this.prisma.lessonRequest.findUnique({
          where: { id },
        });
        if (!existing) {
          throw new NotFoundException('Lesson request not found');
        }
        throw new BadRequestException(
          'Lesson request must be accepted and assigned to you to cancel',
        );
      }

      const updated = await this.prisma.lessonRequest.findUniqueOrThrow({
        where: { id },
      });
      return this.toResponse(updated);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }
}
