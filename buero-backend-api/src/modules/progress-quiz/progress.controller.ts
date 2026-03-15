import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { MyProgressResponseDto } from './dto/my-progress-response.dto';

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Загальний прогрес',
    description:
      'Загальний прогрес поточного користувача: курси, відсотки завершення, пройдені матеріали, поточний рівень (student_profiles). Користувач з JWT (request.user).',
  })
  @ApiResponse({ status: 200, description: 'Прогрес', type: MyProgressResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  getMyProgress(@Req() req: Request) {
    return this.progressService.getMyProgress(req.user!.id);
  }

  @Get('recommended-next')
  @ApiOperation({
    summary: 'Рекомендований наступний курс',
    description:
      'Пропонує наступний курс за рівнем студента (student_profiles.level) та course_progress. Один курс або null. Користувач з JWT.',
  })
  @ApiResponse({ status: 200, description: 'Курс або null' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  getRecommendedNext(@Req() req: Request) {
    return this.progressService.getRecommendedNext(req.user!.id);
  }
}
