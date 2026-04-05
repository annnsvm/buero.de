import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LessonRequestStatus } from '../../../generated/prisma/enums';

/** Відповідь API у snake_case (для Swagger). */
export class LessonRequestResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  student_id!: string;

  @ApiPropertyOptional({ nullable: true })
  teacher_id!: string | null;

  @ApiPropertyOptional({ nullable: true })
  preferred_time!: string | null;

  @ApiPropertyOptional({ nullable: true })
  message!: string | null;

  @ApiProperty({ enum: LessonRequestStatus, enumName: 'LessonRequestStatus' })
  status!: LessonRequestStatus;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;
}
