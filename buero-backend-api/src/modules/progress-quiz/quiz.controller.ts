import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "src/generated/prisma/enums";
import type { UserWithoutPassword } from "../user/types/user-response.type";
import { QuizService } from "./quiz.service";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { SubmitQuizDto } from "./dto/submit-quiz.dto";
import { AttemptResponseDto } from "./dto/attempt-response.dto";
import { SubmitQuizResponseDto } from "./dto/submit-quiz-response.dto";

@ApiTags("quiz")
@Controller("quiz")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@ApiBearerAuth("access_token")
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post("attempts")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Почати спробу квізу",
    description:
      "Створює новий запис у quiz_attempts (без completed_at). Перевірка: матеріал типу quiz, користувач має доступ до курсу (підписка/trial). Тільки для студентів.",
  })
  @ApiBody({ type: CreateAttemptDto })
  @ApiResponse({
    status: 201,
    description: "Спроба створена",
    type: AttemptResponseDto,
  })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 403, description: "Тільки для студентів" })
  @ApiResponse({ status: 404, description: "Матеріал не знайдено" })
  @ApiResponse({ status: 400, description: "Матеріал не є квізом" })
  @ApiResponse({ status: 403, description: "Немає доступу до курсу" })
  startAttempt(
    @CurrentUser() user: UserWithoutPassword,
    @Body() dto: CreateAttemptDto
  ) {
    return this.quizService.startAttempt(
      user.id,
      user.role as Role,
      dto.course_material_id
    );
  }

  @Get("attempts/:attemptId")
  @ApiOperation({
    summary: "Стан спроби (resume)",
    description:
      "Поточний стан спроби квізу: attempt, answers_snapshot, completed_at, score. Для продовження квізу. 404, якщо спроба не знайдена або не належить користувачу. Тільки для студентів.",
  })
  @ApiParam({ name: "attemptId", description: "UUID спроби" })
  @ApiResponse({ status: 200, description: "Спроба", type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 403, description: "Тільки для студентів" })
  @ApiResponse({ status: 404, description: "Спроба не знайдена" })
  getAttempt(
    @CurrentUser("id") userId: string,
    @Param("attemptId") attemptId: string
  ) {
    return this.quizService.getAttempt(attemptId, userId);
  }

  @Post("attempts/:attemptId/submit")
  @ApiOperation({
    summary: "Відправити всі відповіді квізу та завершити спробу",
    description:
      "Приймає масив усіх відповідей, перевіряє по content матеріалу, зберігає в quiz_attempts, рахує score, завершує спробу та оновлює course_progress. Повертає attempt, score, total, correct, results (по кожному питанню). 400 — невалідний block_index/question_id або спроба вже завершена.",
  })
  @ApiParam({ name: "attemptId", description: "UUID спроби" })
  @ApiBody({ type: SubmitQuizDto })
  @ApiResponse({
    status: 200,
    description: "Результат квізу",
    type: SubmitQuizResponseDto,
  })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 403, description: "Тільки для студентів" })
  @ApiResponse({ status: 404, description: "Спроба не знайдена" })
  @ApiResponse({
    status: 400,
    description: "Невірні відповіді або спроба вже завершена",
  })
  submitQuiz(
    @CurrentUser("id") userId: string,
    @Param("attemptId") attemptId: string,
    @Body() body: SubmitQuizDto
  ) {
    return this.quizService.submitQuiz(attemptId, userId, body);
  }
}
