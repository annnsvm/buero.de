import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuizService } from './quiz.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { AttemptResponseDto } from './dto/attempt-response.dto';

@ApiTags('quiz')
@Controller('quiz')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('attempts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Почати спробу квізу',
    description:
      'Створює новий запис у quiz_attempts (без completed_at). Перевірка, що course_material_id — матеріал типу quiz. Користувач з JWT.',
  })
  @ApiBody({ type: CreateAttemptDto })
  @ApiResponse({ status: 201, description: 'Спроба створена', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Матеріал не знайдено' })
  @ApiResponse({ status: 400, description: 'Матеріал не є квізом' })
  startAttempt(@Req() req: Request, @Body() dto: CreateAttemptDto) {
    return this.quizService.startAttempt(req.user!.id, dto.course_material_id);
  }

  @Get('attempts/:attemptId')
  @ApiOperation({
    summary: 'Стан спроби (resume)',
    description:
      'Поточний стан спроби квізу: attempt, answers_snapshot, completed_at, score. Для продовження квізу. 404, якщо спроба не знайдена або не належить користувачу. Користувач з JWT.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiResponse({ status: 200, description: 'Спроба', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  getAttempt(@Req() req: Request, @Param('attemptId') attemptId: string) {
    return this.quizService.getAttempt(attemptId, req.user!.id);
  }

  @Post('attempts/:attemptId/answers')
  @ApiOperation({
    summary: 'Відправити відповідь',
    description:
      'Зберегти одну відповідь (блок) у answers_snapshot (merge). Валідація за структурою квізу. 404 — спроба не знайдена; 400 — невалідні дані або спроба вже завершена. Користувач з JWT.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiBody({ type: SubmitAnswerDto })
  @ApiResponse({ status: 200, description: 'Відповідь збережено', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  @ApiResponse({ status: 400, description: 'Невірний block_index або спроба завершена' })
  submitAnswer(
    @Req() req: Request,
    @Param('attemptId') attemptId: string,
    @Body() body: SubmitAnswerDto,
  ) {
    return this.quizService.submitAnswer(attemptId, req.user!.id, body);
  }

  @Post('attempts/:attemptId/complete')
  @ApiOperation({
    summary: 'Завершити квіз',
    description:
      'Завершення спроби: підрахунок score, completed_at. Оновлення course_progress. 404, якщо спроба не знайдена. Користувач з JWT.',
  })
  @ApiParam({ name: 'attemptId', description: 'UUID спроби' })
  @ApiResponse({ status: 200, description: 'Спроба завершена', type: AttemptResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Спроба не знайдена' })
  completeAttempt(@Req() req: Request, @Param('attemptId') attemptId: string) {
    return this.quizService.completeAttempt(attemptId, req.user!.id);
  }
}
