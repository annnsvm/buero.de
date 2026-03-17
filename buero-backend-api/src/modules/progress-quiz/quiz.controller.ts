import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { QuizService } from './quiz.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { AttemptResponseDto } from './dto/attempt-response.dto';

@ApiTags('quiz')
@Controller('quiz')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@ApiBearerAuth('access_token')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('attempts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Почати спробу квізу',
    description:
      'Створює новий запис у quiz_attempts (без completed_at). Перевірка, що course_material_id — матеріал типу quiz. Тільки для студентів.',
  })
  @ApiBody({ type: CreateAttemptDto })
  @ApiResponse({ status: 201, description: 'Спроба створена', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  @ApiResponse({ status: 404, description: 'Матеріал не знайдено' })
  @ApiResponse({ status: 400, description: 'Матеріал не є квізом' })
  startAttempt(@CurrentUser('id') userId: string, @Body() dto: CreateAttemptDto) {
    return this.quizService.startAttempt(userId, dto.course_material_id);
  }

  @Get('attempts/:attemptId')
  @ApiOperation({
    summary: 'Стан спроби (resume)',
    description:
      'Поточний стан спроби квізу: attempt, answers_snapshot, completed_at, score. Для продовження квізу. 404, якщо спроба не знайдена або не належить користувачу. Тільки для студентів.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiResponse({ status: 200, description: 'Спроба', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  getAttempt(@CurrentUser('id') userId: string, @Param('attemptId') attemptId: string) {
    return this.quizService.getAttempt(attemptId, userId);
  }

  @Post('attempts/:attemptId/answers')
  @ApiOperation({
    summary: 'Відправити відповідь',
    description:
      'Зберегти одну відповідь (блок) у answers_snapshot (merge). Валідація за структурою квізу. 404 — спроба не знайдена; 400 — невалідні дані або спроба вже завершена. Тільки для студентів.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiBody({ type: SubmitAnswerDto })
  @ApiResponse({ status: 200, description: 'Відповідь збережено', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  @ApiResponse({ status: 400, description: 'Невірний block_index або спроба завершена' })
  submitAnswer(
    @CurrentUser('id') userId: string,
    @Param('attemptId') attemptId: string,
    @Body() body: SubmitAnswerDto,
  ) {
    return this.quizService.submitAnswer(attemptId, userId, body);
  }

  @Post('attempts/:attemptId/complete')
  @ApiOperation({
    summary: 'Завершити квіз',
    description:
      'Завершення спроби: підрахунок score, completed_at. Оновлення course_progress. 404, якщо спроба не знайдена. Тільки для студентів.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiResponse({ status: 200, description: 'Спроба завершена', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  completeAttempt(@CurrentUser('id') userId: string, @Param('attemptId') attemptId: string) {
    return this.quizService.completeAttempt(attemptId, userId);
  }
}
