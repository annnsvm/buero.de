import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "src/generated/prisma/enums";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { ListCoursesQueryDto } from "./dto/list-courses-query.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({
    summary: "Список опублікованих курсів (каталог)",
    description:
      "Публічний каталог опублікованих курсів (is_published = true). Використовується на лендінгу. Опційні query: category (language | sociocultural), language (en | de), tags (через кому, напр. Language,Integration), level (A1|A2|B1|B2). У відповіді є поля price, tags, level, durationHours.",
  })
  @ApiQuery({
    name: "category",
    required: false,
    enum: ["language", "sociocultural"],
  })
  @ApiQuery({ name: "language", required: false, enum: ["en", "de"] })
  @ApiQuery({
    name: "tags",
    required: false,
    description: "Фільтр за тегами (через кому). Напр. Language,Integration",
  })
  @ApiQuery({ name: "level", required: false, enum: ["A1", "A2", "B1", "B2"] })
  @ApiResponse({
    status: 200,
    description:
      "Масив опублікованих курсів (поля: price, tags, level, durationHours тощо)",
  })
  list(@Query() query: ListCoursesQueryDto) {
    return this.courseService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Один курс по id (з модулями та матеріалами)",
    description:
      "Повертає курс разом з **модулями** та **матеріалами** кожного модуля в одному запиті (дерево Course → Modules → Materials). Модулі та матеріали відсортовані за order_index. Одного запиту достатньо для відображення повної структури курсу на фронті. 404, якщо не знайдено.",
  })
  @ApiParam({ name: "id", description: "UUID курсу" })
  @ApiResponse({
    status: 200,
    description: "Курс з полем modules; кожен модуль містить materials",
    schema: {
      example: {
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        teacherId: "u1000000-0000-0000-0000-000000000001",
        title: "German A1 Basics",
        description: "Introduction to German language.",
        language: "en",
        category: "language",
        isPublished: true,
        price: 29.99,
        tags: ["Language", "Integration"],
        level: "A1",
        durationHours: 12,
        createdAt: "2025-02-16T10:00:00.000Z",
        updatedAt: "2025-02-16T10:00:00.000Z",
        modules: [
          {
            id: "m1000000-0000-0000-0000-000000000001",
            courseId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            title: "Module 1: Basics",
            orderIndex: 0,
            createdAt: "2025-02-16T10:00:00.000Z",
            updatedAt: "2025-02-16T10:00:00.000Z",
            materials: [
              {
                id: "mat10000-0000-0000-0000-00000000001",
                moduleId: "m1000000-0000-0000-0000-000000000001",
                type: "video",
                title: "Greetings",
                content: { youtube_video_id: "dQw4w9WgXcQ" },
                orderIndex: 0,
                createdAt: "2025-02-16T10:00:00.000Z",
                updatedAt: "2025-02-16T10:00:00.000Z",
              },
              {
                id: "mat10000-0000-0000-0000-00000000002",
                moduleId: "m1000000-0000-0000-0000-000000000001",
                type: "vocabulary",
                title: "Basic words",
                content: {},
                orderIndex: 1,
                createdAt: "2025-02-16T10:00:00.000Z",
                updatedAt: "2025-02-16T10:00:00.000Z",
              },
            ],
          },
          {
            id: "m1000000-0000-0000-0000-000000000002",
            courseId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            title: "Module 2: Grammar",
            orderIndex: 1,
            createdAt: "2025-02-16T10:00:00.000Z",
            updatedAt: "2025-02-16T10:00:00.000Z",
            materials: [],
          },
        ],
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access_token")
  @ApiResponse({ status: 404, description: "Курс не знайдено" })
  @ApiResponse({
    status: 200,
    description:
      "При наявному доступі до курсу у відповіді є my_access: { access_type, trial_ends_at?, first_module_id? }",
  })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  getById(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.courseService.findById(id, true, userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Створити курс",
    description:
      "Тільки для вчителів. Створити новий курс. Повертає створений курс.",
  })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: "Курс створено" })
  @ApiResponse({ status: 400, description: "Помилка валідації" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 403, description: "Тільки для вчителів" })
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Оновити курс",
    description:
      "Тільки для вчителів. Оновити курс за id. Поля body: title, description, language, category, is_published (усі опційні). 404, якщо не знайдено.",
  })
  @ApiParam({ name: "id", description: "UUID курсу" })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: "Курс оновлено" })
  @ApiResponse({ status: 404, description: "Курс не знайдено" })
  @ApiResponse({ status: 400, description: "Помилка валідації" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 403, description: "Тільки для вчителів" })
  update(@Param("id") id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Видалити курс",
    description:
      "Видалити курс за id. Модулі та матеріали видаляються каскадно. 404, якщо не знайдено.",
  })
  @ApiParam({ name: "id", description: "UUID курсу" })
  @ApiResponse({ status: 200, description: "Курс видалено" })
  @ApiResponse({ status: 404, description: "Курс не знайдено" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 403, description: "Тільки для вчителів" })
  delete(@Param("id") id: string) {
    return this.courseService.delete(id);
  }

  @Post(":id/start-trial")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.student)
  @ApiBearerAuth("access_token")
  @ApiOperation({
    summary: "Розпочати пробний період",
    description:
      "Тільки для студентів. Розпочати пробний період для курсу (доступ лише до першого модуля). Повертає course_id, access_type, trial_ends_at.",
  })
  @ApiParam({ name: "id", description: "UUID курсу" })
  @ApiResponse({
    status: 200,
    description: "Пробний період розпочато",
    schema: {
      type: "object",
      properties: {
        course_id: {
          type: "string",
          format: "uuid",
          example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        },
        access_type: { type: "string", enum: ["trial"], example: "trial" },
        trial_ends_at: {
          type: "string",
          format: "date-time",
          example: "2025-03-07T12:00:00.000Z",
        },
      },
      required: ["course_id", "access_type", "trial_ends_at"],
    },
  })
  @ApiResponse({
    status: 400,
    description: "Курс не опублікований або не студент",
  })
  @ApiResponse({ status: 404, description: "Курс не знайдено" })
  @ApiResponse({ status: 409, description: "Вже є доступ до курсу" })
  @ApiResponse({ status: 401, description: "Не авторизовано" })
  @ApiResponse({ status: 403, description: "Тільки для студентів" })
  startTrial(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.courseService.startTrial(userId, id);
  }
}
