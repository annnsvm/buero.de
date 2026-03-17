import { ApiProperty } from '@nestjs/swagger';

export class SubmitQuizResultItemDto {
  @ApiProperty({ example: "q1", description: "ID питання" })
  question_id!: string;

  @ApiProperty({ description: "Чи відповідь правильна" })
  correct!: boolean;
}

/** Відповідь ендпоінту POST /quiz/attempts/:attemptId/submit */
export class SubmitQuizResponseDto {
  @ApiProperty({ description: 'Завершена спроба (status=completed, score заповнено)' })
  attempt!: {
    id: string;
    course_material_id: string;
    status: 'completed';
    answers_snapshot: Record<string, unknown> | null;
    score: number | null;
    completed_at: string | null;
    created_at: string;
  };

  @ApiProperty({ description: 'Відсоток правильних (0–100)' })
  score!: number;

  @ApiProperty({ description: 'Кількість питань' })
  total!: number;

  @ApiProperty({ description: 'Кількість правильних відповідей' })
  correct!: number;

  @ApiProperty({
    type: [SubmitQuizResultItemDto],
    description: 'По кожному питанню: чи відповідь правильна',
  })
  results!: SubmitQuizResultItemDto[];
}
