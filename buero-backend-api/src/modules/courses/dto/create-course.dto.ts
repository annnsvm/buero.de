import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { CourseCategory, Language, Level } from '../../../generated/prisma/enums';

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

  @ApiPropertyOptional({ example: 29.99, description: 'Ціна курсу (наприклад у євро)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    example: ['Language', 'Integration'],
    description: 'Теги для пошуку: Language, Integration, Culture & Life',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: Level, example: 'A1', description: 'Рівень курсу: A1 | A2 | B1 | B2' })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiPropertyOptional({ example: 12, description: 'Тривалість курсу в годинах' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  duration_hours?: number;
}
