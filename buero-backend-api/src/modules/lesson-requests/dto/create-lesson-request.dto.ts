import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateLessonRequestDto {
  @ApiProperty({
    example: "Пн 10:00–11:00 CET",
    description: "Бажаний час / текст для узгодження (MVP без календаря)",
  })
  @IsString()
  @MaxLength(2000)
  preferred_time!: string;

  @ApiPropertyOptional({
    example: "Хочу розібрати тему Present Perfect",
    description: "Опційне повідомлення до вчителя",
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string;
}
