import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';
import { CourseMaterialType } from '../../generated/prisma/enums';

export class CreateCourseMaterialDto {
  @ApiProperty({
    enum: CourseMaterialType,
    example: 'video',
    description: 'Тип матеріалу: video | vocabulary | grammar | quiz | scenario | cultural_insight | homework | text',
  })
  @IsEnum(CourseMaterialType)
  type!: CourseMaterialType;

  @ApiProperty({ example: 'Lesson 1: Greetings', description: 'Назва матеріалу' })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({
    description: 'Вміст: для video — JSON з youtube_video_id; для scenario — JSON з нодами/гілками; інші — текст або JSON',
    example: { youtube_video_id: 'dQw4w9WgXcQ' },
  })
  @IsNotEmpty()
  @IsObject()
  content!: Record<string, unknown>;

  @ApiProperty({ example: 0, description: 'Порядок у курсі (order_index)' })
  @IsInt()
  order_index!: number;
}
