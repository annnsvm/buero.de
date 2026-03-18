import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

/** Одна відповідь: id питання + обраний варіант (відповідно до content.questions[].id або content.blocks[].questions[].id) */
export class SubmitQuizAnswerItemDto {
  @ApiProperty({
    example: "q1",
    description: "ID питання (content.questions[].id або в блоках)",
  })
  @IsString()
  question_id!: string;

  @ApiProperty({
    example: "a",
    description:
      "Відповідь: id варіанту або рядок (має збігатися з correct у питанні)",
    oneOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
  })
  @Allow()
  @IsNotEmpty()
  answer!: string | string[];
}

/** Відправка всіх відповідей квізу за раз. Перевірка по content матеріалу, збереження та завершення спроби. */
export class SubmitQuizDto {
  @ApiProperty({
    type: [SubmitQuizAnswerItemDto],
    example: [
      { question_id: "q1", answer: "a" },
      { question_id: "q2", answer: "b" },
    ],
    description: "Масив відповідей; question_id відповідає id питання в контенті квізу",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitQuizAnswerItemDto)
  answers!: SubmitQuizAnswerItemDto[];
}
