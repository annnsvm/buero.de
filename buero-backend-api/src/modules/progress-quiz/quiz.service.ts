import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role } from "src/generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import type { SubmitQuizDto } from "./dto/submit-quiz.dto";
import type { QuizContentAny, QuizQuestion } from "./types/quiz-content.types";

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseMaterialService: CourseMaterialService,
  ) {}

  async startAttempt(
    userId: string,
    role: Role,
    courseMaterialId: string,
  ) {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: courseMaterialId },
      include: { module: true },
    });
    if (!material) {
      throw new NotFoundException(
        `Матеріал з id ${courseMaterialId} не знайдено`
      );
    }
    if (material.type !== "quiz") {
      throw new BadRequestException(
        "Матеріал не є квізом (type має бути quiz)"
      );
    }
    const courseId = material.module?.courseId;
    if (courseId) {
      await this.courseMaterialService.assertCanAccessCourse(
        userId,
        role,
        courseId,
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

  /**
   * Відправити всі відповіді квізу за раз: валідація по content, збереження snapshot,
   * підрахунок score, завершення спроби, оновлення course_progress.
   */
  async submitQuiz(
    attemptId: string,
    userId: string,
    body: SubmitQuizDto,
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
      throw new BadRequestException(
        "Спробу вже завершено, відповіді не приймаються",
      );
    }

    const content = attempt.courseMaterial.content as QuizContentAny | null;
    const questionsMap = this.getQuestionsByIdMap(content);
    if (questionsMap.size === 0) {
      throw new BadRequestException(
        "Контент квізу невалідний (відсутні questions або blocks[].questions)",
      );
    }

    const snapshot: Record<string, { question_id: string; answer: string | string[] }> = {};
    const results: Array<{ question_id: string; correct: boolean }> = [];
    let correctCount = 0;

    for (const a of body.answers) {
      const question = questionsMap.get(a.question_id);
      if (!question) {
        throw new BadRequestException(
          `Питання з id "${a.question_id}" не знайдено в квізі`,
        );
      }

      const key = `question_${a.question_id}`;
      snapshot[key] = { question_id: a.question_id, answer: a.answer };

      const isCorrect = this.isAnswerCorrect(question.correct, a.answer);
      results.push({ question_id: a.question_id, correct: isCorrect });
      if (isCorrect) correctCount += 1;
    }

    const total = results.length;
    const score =
      total > 0 ? Math.round((correctCount / total) * 10000) / 100 : 0;
    const completedAt = new Date();

    const updated = await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answersSnapshot: snapshot as object,
        score,
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
          score,
        },
        update: { completedAt, score },
      });
    }

    return {
      attempt: this.toAttemptResponse(updated),
      score,
      total,
      correct: correctCount,
      results,
    };
  }

  /**
   * Повертає мапу question_id -> question з контенту.
   * Підтримує обидва формати: content.questions[] (плоский) та content.blocks[].questions[] (legacy).
   */
  private getQuestionsByIdMap(content: QuizContentAny | null): Map<string, QuizQuestion> {
    const map = new Map<string, QuizQuestion>();
    if (content == null || typeof content !== "object") return map;
    const withBlocks = content as { blocks?: Array<{ questions?: QuizQuestion[] }> };
    const flat = content as { questions?: QuizQuestion[] };
    if (Array.isArray(flat.questions)) {
      for (const q of flat.questions) {
        if (q?.id != null) map.set(q.id, q);
      }
      return map;
    }
    if (Array.isArray(withBlocks.blocks)) {
      for (const block of withBlocks.blocks) {
        if (!Array.isArray(block.questions)) continue;
        for (const q of block.questions) {
          if (q?.id != null) map.set(q.id, q);
        }
      }
    }
    return map;
  }

  /** Порівняння відповіді з правильним значенням (string або масив правильних) */
  private isAnswerCorrect(
    correct: string | string[] | undefined,
    answer: string | string[],
  ): boolean {
    if (correct === undefined) return false;
    const norm = (v: string | string[]) =>
      Array.isArray(v) ? v.map(String).sort().join(",") : String(v);
    return norm(correct) === norm(answer);
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
      status: attempt.completedAt
        ? ("completed" as const)
        : ("in_progress" as const),
      answers_snapshot: attempt.answersSnapshot as Record<
        string,
        unknown
      > | null,
      score: attempt.score != null ? Number(attempt.score) : null,
      completed_at: attempt.completedAt?.toISOString() ?? null,
      created_at: attempt.createdAt.toISOString(),
    };
  }

}
