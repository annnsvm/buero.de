import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVocabularyDto {
  @ApiProperty({ example: 'Arbeit', description: 'Слово (унікальне)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  word!: string;

  @ApiProperty({ example: 'робота', description: 'Переклад' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  translation!: string;

  @ApiPropertyOptional({ example: 'ˈaʁbaɪ̯t', description: 'Вимова (транскрипція)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  pronunciation?: string;

  @ApiPropertyOptional({
    example: 'Ich gehe zur Arbeit.',
    description: 'Приклад речення',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  example_sentence?: string;
}
