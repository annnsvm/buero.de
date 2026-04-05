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
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateLessonRequestDto } from "./dto/create-lesson-request.dto";
import { LessonRequestActorQueryDto } from "./dto/lesson-request-actor.query.dto";
import { LessonRequestService } from "./lesson-request.service";

@ApiTags("lesson-requests")
@Controller("lesson-requests")
export class LessonRequestsController {
  constructor(private readonly lessonRequestService: LessonRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Створити запит на заняття",
    description:
      "Студент створює запит (preferred_time, опційно message). Статус за замовчуванням pending. До підключення JWT передайте userId та role=student у query.",
  })
  @ApiQuery({ name: "userId", type: String, format: "uuid" })
  @ApiQuery({ name: "role", enum: ["student", "teacher"] })
  @ApiBody({ type: CreateLessonRequestDto })
  @ApiResponse({
    status: 201,
    description: "Запит створено",
    schema: {
      example: {
        id: "uuid",
        student_id: "uuid",
        teacher_id: null,
        preferred_time: "Пн 10:00",
        message: null,
        status: "pending",
        created_at: "2026-01-01T12:00:00.000Z",
        updated_at: "2026-01-01T12:00:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 400, description: "Невалідні дані або не студент" })
  @ApiResponse({ status: 404, description: "Користувач не знайдено" })
  create(
    @Body() dto: CreateLessonRequestDto,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.create(actor.userId, actor.role, dto);
  }

  @Get("me")
  @ApiOperation({
    summary: "Мої запити",
    description:
      "Студент: усі свої запити. Вчитель: усі pending + запити, де teacher_id = поточний користувач. До JWT — userId та role у query.",
  })
  @ApiQuery({ name: "userId", type: String, format: "uuid" })
  @ApiQuery({ name: "role", enum: ["student", "teacher"] })
  @ApiResponse({ status: 200, description: "Масив запитів" })
  @ApiResponse({ status: 400, description: "Невідома роль" })
  @ApiResponse({ status: 404, description: "Користувач не знайдено" })
  findMy(@Query() actor: LessonRequestActorQueryDto) {
    return this.lessonRequestService.findMyRequests(actor.userId, actor.role);
  }

  @Patch(":id/accept")
  @ApiOperation({
    summary: "Прийняти запит (вчитель)",
    description:
      "Лише для pending: встановлює teacher_id та status accepted. До JWT — userId та role=teacher у query.",
  })
  @ApiParam({ name: "id", description: "UUID запиту" })
  @ApiQuery({ name: "userId", type: String, format: "uuid" })
  @ApiQuery({ name: "role", enum: ["student", "teacher"] })
  @ApiResponse({ status: 200, description: "Запит прийнято" })
  @ApiResponse({
    status: 400,
    description: "Не pending, не вчитель або інша помилка",
  })
  @ApiResponse({ status: 404, description: "Запит або користувач не знайдено" })
  accept(
    @Param("id") id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.accept(id, actor.userId, actor.role);
  }

  @Patch(":id/reject")
  @ApiOperation({
    summary: "Відхилити запит (вчитель, до прийняття)",
    description:
      "Лише для pending: status rejected. До JWT — userId та role=teacher у query.",
  })
  @ApiParam({ name: "id", description: "UUID запиту" })
  @ApiQuery({ name: "userId", type: String, format: "uuid" })
  @ApiQuery({ name: "role", enum: ["student", "teacher"] })
  @ApiResponse({ status: 200, description: "Запит відхилено" })
  @ApiResponse({ status: 400, description: "Не pending або не вчитель" })
  @ApiResponse({ status: 404, description: "Запит або користувач не знайдено" })
  reject(
    @Param("id") id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.reject(id, actor.userId, actor.role);
  }

  @Patch(":id/complete")
  @ApiOperation({
    summary: "Заняття проведено",
    description:
      "Лише для accepted; лише призначений вчитель (teacher_id). Статус completed. До JWT — query userId, role=teacher.",
  })
  @ApiParam({ name: "id", description: "UUID запиту" })
  @ApiQuery({ name: "userId", type: String, format: "uuid" })
  @ApiQuery({ name: "role", enum: ["student", "teacher"] })
  @ApiResponse({ status: 200, description: "Статус completed" })
  @ApiResponse({ status: 400, description: "Невалідний стан або не той вчитель" })
  @ApiResponse({ status: 404, description: "Запит або користувач не знайдено" })
  complete(
    @Param("id") id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.complete(id, actor.userId, actor.role);
  }

  @Patch(":id/cancel")
  @ApiOperation({
    summary: "Скасувати після прийняття",
    description:
      "Лише для accepted; лише призначений вчитель. Статус rejected (заняття не відбулось). До JWT — query userId, role=teacher.",
  })
  @ApiParam({ name: "id", description: "UUID запиту" })
  @ApiQuery({ name: "userId", type: String, format: "uuid" })
  @ApiQuery({ name: "role", enum: ["student", "teacher"] })
  @ApiResponse({ status: 200, description: "Статус rejected" })
  @ApiResponse({ status: 400, description: "Невалідний стан або не той вчитель" })
  @ApiResponse({ status: 404, description: "Запит або користувач не знайдено" })
  cancel(
    @Param("id") id: string,
    @Query() actor: LessonRequestActorQueryDto,
  ) {
    return this.lessonRequestService.cancel(id, actor.userId, actor.role);
  }
}
