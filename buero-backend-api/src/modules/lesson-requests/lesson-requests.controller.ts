import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LessonRequestService } from './lesson-request.service';
import { CreateLessonRequestDto } from './dto/create-lesson-request.dto';
import { LessonRequestActorQueryDto } from './dto/lesson-request-actor.query.dto';
import { LessonRequestResponseDto } from './dto/lesson-request-response.dto';

@ApiTags('lesson-requests')
@Controller('lesson-requests')
export class LessonRequestsController {
  constructor(private readonly lessonRequestService: LessonRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Створити запит на заняття',
    description:
      'Студент створює запит (status = pending). Ідентичність: query userId + role (тимчасово).',
  })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'role', enum: ['student', 'teacher'], required: true })
  @ApiBody({ type: CreateLessonRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Створений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалідні дані або не студент' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  create(
    @Query() actor: LessonRequestActorQueryDto,
    @Body() dto: CreateLessonRequestDto,
  ) {
    return this.lessonRequestService.create(actor.userId, actor.role, dto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Мої запити',
    description:
      'Студент: усі запити з student_id = userId. Вчитель: усі pending + запити з teacher_id = userId.',
  })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'role', enum: ['student', 'teacher'], required: true })
  @ApiResponse({
    status: 200,
    description: 'Список запитів',
    type: [LessonRequestResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Роль не збігається з обліковим записом' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  findMy(@Query() actor: LessonRequestActorQueryDto) {
    return this.lessonRequestService.findMyRequests(actor.userId, actor.role);
  }

  @Patch(':id/accept')
  @ApiOperation({
    summary: 'Прийняти запит',
    description: 'pending → accepted, teacher_id = поточний вчитель.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'role', enum: ['student', 'teacher'], required: true })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Статус не pending або не вчитель' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  accept(
    @Param('id') id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.accept(id, actor.userId, actor.role);
  }

  @Patch(':id/reject')
  @ApiOperation({
    summary: 'Відхилити запит (до прийняття)',
    description: 'pending → rejected.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'role', enum: ['student', 'teacher'], required: true })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Статус не pending або не вчитель' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  reject(
    @Param('id') id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.reject(id, actor.userId, actor.role);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Позначити заняття як проведене',
    description: 'accepted + ваш teacher_id → completed.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'role', enum: ['student', 'teacher'], required: true })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалідний стан або не вчитель' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  complete(
    @Param('id') id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.complete(id, actor.userId, actor.role);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Скасувати після прийняття',
    description: 'accepted + ваш teacher_id → rejected.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'role', enum: ['student', 'teacher'], required: true })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалідний стан або не вчитель' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  cancel(
    @Param('id') id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.cancel(id, actor.userId, actor.role);
  }
}
