import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { getUserIdFromRequest } from '../../helpers/user-id.helper';
import { ProgressService } from './progress.service';
import { CompleteMaterialDto } from './dto/complete-material.dto';
import { CourseProgressResponseDto } from './dto/course-progress-response.dto';

@ApiTags('progress')
@Controller('courses')
export class CourseProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':courseId/progress')
  @ApiOperation({
    summary: 'Прогрес по курсу',
    description:
      'Прогрес по курсу для користувача: список завершених матеріалів (course_progress). Опційно module_id для кожного матеріалу для UI. 404, якщо курс не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiResponse({ status: 200, description: 'Список завершених матеріалів', type: CourseProgressResponseDto })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  @ApiResponse({ status: 400, description: 'userId не передано' })
  getCourseProgress(@Req() req: Request, @Param('courseId') courseId: string) {
    const userId = getUserIdFromRequest(req);
    return this.progressService.getCourseProgress(userId, courseId);
  }

  @Post(':courseId/modules/:moduleId/materials/:materialId/complete')
  @ApiOperation({
    summary: 'Позначити матеріал пройденим',
    description:
      'Створює або оновлює запис у course_progress (completed_at, опційно score). Перевірка існування курсу, модуля та матеріалу та приналежності матеріалу до модуля й курсу. 404 при відсутності сутності.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'materialId', description: 'UUID матеріалу' })
  @ApiBody({ type: CompleteMaterialDto, required: false })
  @ApiResponse({ status: 200, description: 'Матеріал позначено пройденим' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  @ApiResponse({ status: 400, description: 'userId не передано або невалідні дані' })
  completeMaterial(
    @Req() req: Request,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('materialId') materialId: string,
    @Body() body?: CompleteMaterialDto,
  ) {
    const userId = getUserIdFromRequest(req);
    return this.progressService.completeMaterial(
      userId,
      courseId,
      moduleId,
      materialId,
      body?.score,
    );
  }
}
