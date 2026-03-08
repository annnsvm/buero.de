import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { CourseCategory, Language } from '../../../generated/prisma/enums';

export class CreateCourseDto {
  @ApiProperty({ example: 'German A1 Basics', description: 'Назва курсу' })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiPropertyOptional({ example: 'Introduction to German language.', description: 'Опис курсу' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Language, example: 'en', description: 'Мова контенту курсу' })
  @IsEnum(Language)
  language!: Language;

  @ApiProperty({ enum: CourseCategory, example: 'language', description: 'Категорія: language | sociocultural' })
  @IsEnum(CourseCategory)
  category!: CourseCategory;

  @ApiPropertyOptional({ default: false, description: 'Чи опублікований курс' })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;
}
