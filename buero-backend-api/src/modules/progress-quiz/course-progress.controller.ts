import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
import { ProgressService } from './progress.service';
import { CompleteMaterialDto } from './dto/complete-material.dto';
import { CourseProgressResponseDto } from './dto/course-progress-response.dto';

@ApiTags('progress')
@Controller('courses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
export class CourseProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':courseId/progress')
  @ApiOperation({
    summary: 'Прогрес по курсу',
    description:
      'Прогрес по курсу для поточного користувача: список завершених матеріалів (course_progress). Опційно module_id для UI. 404, якщо курс не знайдено. Користувач з JWT.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiResponse({ status: 200, description: 'Список завершених матеріалів', type: CourseProgressResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  getCourseProgress(@Req() req: Request, @Param('courseId') courseId: string) {
    return this.progressService.getCourseProgress(req.user!.id, courseId);
  }

  @Post(':courseId/modules/:moduleId/materials/:materialId/complete')
  @ApiOperation({
    summary: 'Позначити матеріал пройденим',
    description:
      'Створює або оновлює запис у course_progress (completed_at, опційно score). Перевірка курсу, модуля та матеріалу. 404 при відсутності сутності. Користувач з JWT.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'materialId', description: 'UUID матеріалу' })
  @ApiBody({ type: CompleteMaterialDto, required: false })
  @ApiResponse({ status: 200, description: 'Матеріал позначено пройденим' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  completeMaterial(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('materialId') materialId: string,
    @Body() body?: CompleteMaterialDto,
  ) {
    return this.progressService.completeMaterial(
      req.user!.id,
      courseId,
      moduleId,
      materialId,
      body?.score,
    );
  }
}
