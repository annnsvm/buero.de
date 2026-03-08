import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CourseCategory, Language } from '../../generated/prisma/enums';

export class ListCoursesQueryDto {
  @ApiPropertyOptional({ enum: CourseCategory, description: 'Фільтр за категорією' })
  @IsOptional()
  @IsEnum(CourseCategory)
  category?: CourseCategory;

  @ApiPropertyOptional({ enum: Language, description: 'Фільтр за мовою контенту' })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
