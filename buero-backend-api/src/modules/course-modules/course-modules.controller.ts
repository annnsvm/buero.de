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
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { CourseModuleService } from './course-module.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';

@ApiTags('course-modules')
@Controller('courses/:courseId/modules')
export class CourseModulesController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Список модулів курсу',
    description:
      'Список модулів курсу за order_index. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiResponse({ status: 200, description: 'Список модулів' })
  @ApiResponse({ status: 403, description: 'Немає доступу до курсу' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  async list(
    @Req() req: Request,
    @Param('courseId') courseId: string,
  ) {
    await this.courseModuleService.assertCanAccessCourse(
      req.user!.id,
      req.user!.role,
      courseId,
    );
    return this.courseModuleService.findAllByCourseId(
      courseId,
      req.user!.id,
      req.user!.role,
    );
  }

  @Get(':moduleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Один модуль по id',
    description:
      'Один модуль. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiResponse({ status: 200, description: 'Модуль знайдено' })
  @ApiResponse({ status: 403, description: 'Немає доступу до курсу' })
  @ApiResponse({ status: 404, description: 'Курс або модуль не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  async getById(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.courseModuleService.findOne(
      courseId,
      moduleId,
      req.user!.id,
      req.user!.role,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Створити модуль у курсі',
    description: 'Тільки для вчителів. Body: title, order_index.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiBody({ type: CreateCourseModuleDto })
  @ApiResponse({ status: 201, description: 'Модуль створено' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseModuleDto,
  ) {
    return this.courseModuleService.create(courseId, dto);
  }

  @Patch(':moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Оновити модуль',
    description: 'Тільки для вчителів. Оновити модуль (title, order_index).',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiBody({ type: UpdateCourseModuleDto })
  @ApiResponse({ status: 200, description: 'Модуль оновлено' })
  @ApiResponse({ status: 404, description: 'Курс або модуль не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  update(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateCourseModuleDto,
  ) {
    return this.courseModuleService.update(courseId, moduleId, dto);
  }

  @Delete(':moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Видалити модуль',
    description:
      'Тільки для вчителів. Видалити модуль. Матеріали модуля видаляються каскадно.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiResponse({ status: 200, description: 'Модуль видалено' })
  @ApiResponse({ status: 404, description: 'Курс або модуль не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  delete(@Param('courseId') courseId: string, @Param('moduleId') moduleId: string) {
    return this.courseModuleService.delete(courseId, moduleId);
  }
}
