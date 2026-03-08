import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CourseMaterialService } from './course-material.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

@ApiTags('course-materials')
@Controller('courses/:courseId/materials')
export class CourseMaterialsController {
  constructor(private readonly courseMaterialService: CourseMaterialService) {}

  @Get()
  @ApiOperation({
    summary: 'Список матеріалів курсу',
    description:
      'Список матеріалів курсу за course_id, відсортованих за order_index. 404, якщо курс не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiResponse({ status: 200, description: 'Список матеріалів' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  list(@Param('courseId') courseId: string) {
    return this.courseMaterialService.findAllByCourseId(courseId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Один матеріал по id',
    description:
      'Один матеріал по id; перевірка, що матеріал належить курсу (course_id = courseId). 404, якщо курс або матеріал не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiResponse({ status: 200, description: 'Матеріал знайдено' })
  @ApiResponse({ status: 404, description: 'Курс або матеріал не знайдено' })
  getById(@Param('courseId') courseId: string, @Param('id') id: string) {
    return this.courseMaterialService.findOne(courseId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Додати матеріал до курсу',
    description:
      'Body: type, title, content, order_index. Перевірка існування курсу; 404, якщо курс не знайдено. Повертає створений матеріал.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiBody({ type: CreateCourseMaterialDto })
  @ApiResponse({ status: 201, description: 'Матеріал створено' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseMaterialDto,
  ) {
    return this.courseMaterialService.create(courseId, dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Оновити матеріал',
    description:
      'Оновити матеріал (поля для оновлення). Перевірка, що матеріал належить курсу. 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiBody({ type: UpdateCourseMaterialDto })
  @ApiResponse({ status: 200, description: 'Матеріал оновлено' })
  @ApiResponse({ status: 404, description: 'Курс або матеріал не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  update(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCourseMaterialDto,
  ) {
    return this.courseMaterialService.update(courseId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Видалити матеріал',
    description:
      'Видалити матеріал. Перевірка приналежності до курсу. 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiResponse({ status: 200, description: 'Матеріал видалено' })
  @ApiResponse({ status: 404, description: 'Курс або матеріал не знайдено' })
  delete(@Param('courseId') courseId: string, @Param('id') id: string) {
    return this.courseMaterialService.delete(courseId, id);
  }
}
