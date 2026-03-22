import { PartialType } from '@nestjs/swagger';
import { CreateVocabularyDto } from './create-vocabulary.dto';

export class UpdateVocabularyDto extends PartialType(CreateVocabularyDto) {}
