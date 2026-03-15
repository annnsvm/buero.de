import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async startAttempt(userId: string, courseMaterialId: string) {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: courseMaterialId },
    });
    if (!material) {
      throw new NotFoundException(`Матеріал з id ${courseMaterialId} не знайдено`);
    }
    if (material.type !== 'quiz') {
      throw new BadRequestException(
        'Матеріал не є квізом (type має бути quiz)',
      );
    }

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        courseMaterialId,
      },
    });

    return this.toAttemptResponse(attempt);
  }

  async getAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });
    if (!attempt) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.userId !== userId) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    return this.toAttemptResponse(attempt);
  }

  async submitAnswer(
    attemptId: string,
    userId: string,
    body: SubmitAnswerDto,
  ) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { courseMaterial: true },
    });
    if (!attempt) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.userId !== userId) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.completedAt) {
      throw new BadRequestException('Спробу вже завершено, відповіді не приймаються');
    }

    const content = attempt.courseMaterial.content as Record<string, unknown> | null;
    if (content && typeof content === 'object') {
      const blocks = content.blocks as Array<{ questions?: unknown[] }> | undefined;
      if (Array.isArray(blocks) && (body.block_index < 0 || body.block_index >= blocks.length)) {
        throw new BadRequestException(`Невірний block_index: ${body.block_index}`);
      }
    }

    const current = (attempt.answersSnapshot as Record<string, unknown>) ?? {};
    const key = `block_${body.block_index}_${body.question_id}`;
    const merged = { ...current, [key]: { block_index: body.block_index, question_id: body.question_id, answer: body.answer } };

    const updated = await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { answersSnapshot: merged as object },
    });

    return this.toAttemptResponse(updated);
  }

  async completeAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { courseMaterial: true },
    });
    if (!attempt) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.userId !== userId) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.completedAt) {
      return this.toAttemptResponse(attempt);
    }

    const score = this.calculateScore(attempt.courseMaterial.content, attempt.answersSnapshot);
    const completedAt = new Date();

    const updated = await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score: score != null ? score : null,
        completedAt,
      },
    });

    const materialWithModule = await this.prisma.courseMaterial.findUnique({
      where: { id: attempt.courseMaterialId },
      include: { module: true },
    });
    if (materialWithModule?.module?.courseId) {
      const courseId = materialWithModule.module.courseId;
      await this.prisma.courseProgress.upsert({
        where: {
          userId_courseId_courseMaterialId: {
            userId,
            courseId,
            courseMaterialId: attempt.courseMaterialId,
          },
        },
        create: {
          userId,
          courseId,
          courseMaterialId: attempt.courseMaterialId,
          completedAt,
          score: score != null ? score : null,
        },
        update: { completedAt, score: score != null ? score : null },
      });
    }

    return this.toAttemptResponse(updated);
  }

  private toAttemptResponse(attempt: {
    id: string;
    courseMaterialId: string;
    answersSnapshot: unknown;
    score: unknown;
    completedAt: Date | null;
    createdAt: Date;
  }) {
    return {
      id: attempt.id,
      course_material_id: attempt.courseMaterialId,
      status: attempt.completedAt ? 'completed' as const : 'in_progress' as const,
      answers_snapshot: attempt.answersSnapshot as Record<string, unknown> | null,
      score: attempt.score != null ? Number(attempt.score) : null,
      completed_at: attempt.completedAt?.toISOString() ?? null,
      created_at: attempt.createdAt.toISOString(),
    };
  }

  private calculateScore(
    content: unknown,
    answersSnapshot: unknown,
  ): number | null {
    if (content == null || typeof content !== 'object') return null;
    const cont = content as Record<string, unknown>;
    const blocks = cont.blocks as Array<{ questions?: Array<{ correct?: unknown; id?: string }> }> | undefined;
    if (!Array.isArray(blocks)) return null;
    const snapshot = (answersSnapshot as Record<string, unknown>) ?? {};
    let correct = 0;
    let total = 0;
    for (let bi = 0; bi < blocks.length; bi++) {
      const questions = blocks[bi].questions;
      if (!Array.isArray(questions)) continue;
      for (const q of questions) {
        const qId = q.id ?? '';
        const key = `block_${bi}_${qId}`;
        const saved = snapshot[key] as { answer?: unknown } | undefined;
        if (saved?.answer !== undefined) {
          total += 1;
          if (q.correct !== undefined && String(saved.answer) === String(q.correct)) {
            correct += 1;
          }
        }
      }
    }
    if (total === 0) return null;
    return Math.round((correct / total) * 10000) / 100;
  }
}
