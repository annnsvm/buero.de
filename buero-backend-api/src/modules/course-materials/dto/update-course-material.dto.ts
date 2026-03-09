import { PartialType } from '@nestjs/swagger';
import { CreateCourseMaterialDto } from './create-course-material.dto';

export class UpdateCourseMaterialDto extends PartialType(CreateCourseMaterialDto) {}
