import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength } from "class-validator";

export class CreateCourseModuleDto {
  @ApiProperty({ example: "Module 1: Basics", description: "Назва модуля" })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({
    example: 0,
    description: "Порядок модуля в курсі (order_index)",
  })
  @IsInt()
  order_index!: number;
}
