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
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { CourseMaterialService } from './course-material.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

@ApiTags('course-materials')
@Controller('courses/:courseId/modules/:moduleId/materials')
export class CourseMaterialsController {
  constructor(private readonly courseMaterialService: CourseMaterialService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Список матеріалів модуля',
    description:
      'Список матеріалів модуля. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу. 403 при відсутності доступу.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiResponse({ status: 200, description: 'Список матеріалів' })
  @ApiResponse({ status: 403, description: 'Немає доступу до курсу' })
  @ApiResponse({ status: 404, description: 'Курс або модуль не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  async list(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    await this.courseMaterialService.assertCanAccessModule(
      req.user!.id,
      req.user!.role,
      courseId,
      moduleId,
    );
    return this.courseMaterialService.findAllByModuleId(courseId, moduleId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Один матеріал по id',
    description:
      'Один матеріал по id. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу. 403 при відсутності доступу.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiResponse({ status: 200, description: 'Матеріал знайдено' })
  @ApiResponse({ status: 403, description: 'Немає доступу до курсу' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  async getById(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') id: string,
  ) {
    await this.courseMaterialService.assertCanAccessModule(
      req.user!.id,
      req.user!.role,
      courseId,
      moduleId,
    );
    return this.courseMaterialService.findOne(courseId, moduleId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Додати матеріал до модуля',
    description:
      'Тільки для вчителів. Body: type, title, content, order_index. 404, якщо курс або модуль не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiBody({ type: CreateCourseMaterialDto })
  @ApiResponse({ status: 201, description: 'Матеріал створено' })
  @ApiResponse({ status: 404, description: 'Курс або модуль не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  create(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateCourseMaterialDto,
  ) {
    return this.courseMaterialService.create(courseId, moduleId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Оновити матеріал',
    description: 'Тільки для вчителів. Оновити матеріал (поля для оновлення). 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiBody({ type: UpdateCourseMaterialDto })
  @ApiResponse({ status: 200, description: 'Матеріал оновлено' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  update(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCourseMaterialDto,
  ) {
    return this.courseMaterialService.update(
      courseId,
      moduleId,
      id,
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Видалити матеріал',
    description: 'Тільки для вчителів. Видалити матеріал. 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiResponse({ status: 200, description: 'Матеріал видалено' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  delete(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') id: string,
  ) {
    return this.courseMaterialService.delete(courseId, moduleId, id);
  }
}
