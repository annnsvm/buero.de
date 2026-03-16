import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { ProgressService } from './progress.service';
import { MyProgressResponseDto } from './dto/my-progress-response.dto';

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@ApiBearerAuth('access_token')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Загальний прогрес',
    description:
      'Загальний прогрес поточного користувача: курси, відсотки завершення, пройдені матеріали, поточний рівень (student_profiles). Тільки для студентів.',
  })
  @ApiResponse({ status: 200, description: 'Прогрес', type: MyProgressResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  getMyProgress(@CurrentUser('id') userId: string) {
    return this.progressService.getMyProgress(userId);
  }

  @Get('recommended-next')
  @ApiOperation({
    summary: 'Рекомендований наступний курс',
    description:
      'Пропонує наступний курс за рівнем студента (student_profiles.level) та course_progress. Один курс або null. Тільки для студентів.',
  })
  @ApiResponse({ status: 200, description: 'Курс або null' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  getRecommendedNext(@CurrentUser('id') userId: string) {
    return this.progressService.getRecommendedNext(userId);
  }
}
