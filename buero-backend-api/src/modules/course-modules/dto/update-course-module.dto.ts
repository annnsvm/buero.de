import { PartialType } from '@nestjs/swagger';
import { CreateCourseModuleDto } from './create-course-module.dto';

export class UpdateCourseModuleDto extends PartialType(CreateCourseModuleDto) {}
