import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLessonRequestDto {
  @ApiProperty({
    example: 'Пн 10:00',
    description: 'Бажаний час заняття (текст для MVP)',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  preferred_time!: string;

  @ApiPropertyOptional({ example: 'Хочу розмовну практику' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string;
}
