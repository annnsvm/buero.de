import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
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
import { Request } from 'express';
import { getUserIdFromRequest } from '../../helpers/user-id.helper';
import { ProgressService } from './progress.service';
import { CompleteMaterialDto } from './dto/complete-material.dto';
import { CourseProgressResponseDto } from './dto/course-progress-response.dto';
import { MyProgressResponseDto } from './dto/my-progress-response.dto';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Загальний прогрес',
    description:
      'Загальний прогрес поточного користувача: курси, відсотки завершення, пройдені матеріали, поточний рівень (student_profiles). userId тимчасово: query userId=, body або заголовок x-user-id.',
  })
  @ApiQuery({ name: 'userId', description: 'UUID користувача (тимчасово до Auth)' })
  @ApiResponse({ status: 200, description: 'Прогрес', type: MyProgressResponseDto })
  @ApiResponse({ status: 400, description: 'userId не передано' })
  getMyProgress(@Req() req: Request) {
    const userId = getUserIdFromRequest(req);
    return this.progressService.getMyProgress(userId);
  }

  @Get('recommended-next')
  @ApiOperation({
    summary: 'Рекомендований наступний курс',
    description:
      'Пропонує наступний курс за рівнем студента (student_profiles.level) та course_progress. Один курс або null.',
  })
  @ApiQuery({ name: 'userId', description: 'UUID користувача (тимчасово до Auth)' })
  @ApiResponse({ status: 200, description: 'Курс або null' })
  @ApiResponse({ status: 400, description: 'userId не передано' })
  getRecommendedNext(@Req() req: Request) {
    const userId = getUserIdFromRequest(req);
    return this.progressService.getRecommendedNext(userId);
  }
}
