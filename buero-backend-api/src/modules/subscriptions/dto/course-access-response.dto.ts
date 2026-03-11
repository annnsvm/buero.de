import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserCourseAccessType } from "src/generated/prisma/enums";

export class CourseAccessResponseDto {
  @ApiProperty({ description: "ID доступу" })
  id!: string;

  @ApiProperty({ description: "ID курсу" })
  course_id!: string;

  @ApiProperty({
    description: "Тип доступу",
    enum: UserCourseAccessType,
  })
  access_type!: string;

  @ApiPropertyOptional({ description: "Кінець trial (якщо trial)" })
  trial_ends_at?: Date;

  @ApiPropertyOptional({ description: "ID платежу (якщо purchase)" })
  payment_id?: string;

  @ApiPropertyOptional({ description: "ID підписки (якщо subscription)" })
  subscription_id?: string;

  @ApiProperty({ description: "Дата створення" })
  created_at!: Date;
}
