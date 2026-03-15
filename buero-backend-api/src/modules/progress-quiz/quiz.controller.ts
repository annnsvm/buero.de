import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { getUserIdFromRequest } from '../../helpers/user-id.helper';
import { QuizService } from './quiz.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { AttemptResponseDto } from './dto/attempt-response.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('attempts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Почати спробу квізу',
    description:
      'Створює новий запис у quiz_attempts (без completed_at). Перевірка, що course_material_id — матеріал типу quiz. Повертає спробу (id, status).',
  })
  @ApiBody({ type: CreateAttemptDto })
  @ApiResponse({ status: 201, description: 'Спроба створена', type: AttemptResponseDto })
  @ApiResponse({ status: 404, description: 'Матеріал не знайдено' })
  @ApiResponse({ status: 400, description: 'Матеріал не є квізом або userId не передано' })
  startAttempt(@Req() req: Request, @Body() dto: CreateAttemptDto) {
    const userId = getUserIdFromRequest(req);
    return this.quizService.startAttempt(userId, dto.course_material_id);
  }

  @Get('attempts/:attemptId')
  @ApiOperation({
    summary: 'Стан спроби (resume)',
    description:
      'Поточний стан спроби квізу: attempt, answers_snapshot, completed_at, score. Для продовження квізу. 404, якщо спроба не знайдена або не належить користувачу.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiResponse({ status: 200, description: 'Спроба', type: AttemptResponseDto })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  @ApiResponse({ status: 400, description: 'userId не передано' })
  getAttempt(@Req() req: Request, @Param('attemptId') attemptId: string) {
    const userId = getUserIdFromRequest(req);
    return this.quizService.getAttempt(attemptId, userId);
  }

  @Post('attempts/:attemptId/answers')
  @ApiOperation({
    summary: 'Відправити відповідь',
    description:
      'Зберегти одну відповідь (блок) у answers_snapshot (merge). Валідація за структурою квізу. 404 — спроба не знайдена; 400 — невалідні дані або спроба вже завершена.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiBody({ type: SubmitAnswerDto })
  @ApiResponse({ status: 200, description: 'Відповідь збережено', type: AttemptResponseDto })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  @ApiResponse({ status: 400, description: 'Невірний block_index або userId не передано' })
  submitAnswer(
    @Req() req: Request,
    @Param('attemptId') attemptId: string,
    @Body() body: SubmitAnswerDto,
  ) {
    const userId = getUserIdFromRequest(req);
    return this.quizService.submitAnswer(attemptId, userId, body);
  }

  @Post('attempts/:attemptId/complete')
  @ApiOperation({
    summary: 'Завершити квіз',
    description:
      'Завершення спроби: підрахунок score, встановлення completed_at. Оновлення course_progress та за правилами student_profiles.level. 404, якщо спроба не знайдена.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiResponse({ status: 200, description: 'Спроба завершена', type: AttemptResponseDto })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  @ApiResponse({ status: 400, description: 'userId не передано' })
  completeAttempt(@Req() req: Request, @Param('attemptId') attemptId: string) {
    const userId = getUserIdFromRequest(req);
    return this.quizService.completeAttempt(attemptId, userId);
  }
}
