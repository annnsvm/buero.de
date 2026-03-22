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
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/generated/prisma/enums';
import { VocabularyService } from './vocabulary.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

@ApiTags('vocabulary')
@Controller('vocabulary')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Список словника',
    description:
      'Повертає всі записи глобального словника. Опційний query ?search= фільтрує за word або translation (case-insensitive).',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Пошук за word або translation',
  })
  @ApiResponse({ status: 200, description: 'Масив записів словника' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  findAll(@Query('search') search?: string) {
    return this.vocabularyService.findAll(search);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Один запис словника',
    description: 'Повертає запис за id. 404 якщо не знайдено.',
  })
  @ApiParam({ name: 'id', description: 'UUID запису' })
  @ApiResponse({ status: 200, description: 'Запис словника' })
  @ApiResponse({ status: 404, description: 'Запис не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  findById(@Param('id') id: string) {
    return this.vocabularyService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Створити запис',
    description:
      'Тільки для вчителів. Створити новий запис у глобальному словнику. 409, якщо word вже існує.',
  })
  @ApiBody({ type: CreateVocabularyDto })
  @ApiResponse({ status: 201, description: 'Запис створено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  @ApiResponse({ status: 409, description: 'Слово вже існує у словнику' })
  create(@Body() dto: CreateVocabularyDto) {
    return this.vocabularyService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Оновити запис',
    description:
      'Тільки для вчителів. Оновити запис за id (часткове оновлення). 404 якщо не знайдено, 409 якщо word вже зайнятий.',
  })
  @ApiParam({ name: 'id', description: 'UUID запису' })
  @ApiBody({ type: UpdateVocabularyDto })
  @ApiResponse({ status: 200, description: 'Запис оновлено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  @ApiResponse({ status: 404, description: 'Запис не знайдено' })
  @ApiResponse({ status: 409, description: 'Слово вже існує у словнику' })
  update(@Param('id') id: string, @Body() dto: UpdateVocabularyDto) {
    return this.vocabularyService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Видалити запис',
    description: 'Тільки для вчителів. Видалити запис за id. 404 якщо не знайдено.',
  })
  @ApiParam({ name: 'id', description: 'UUID запису' })
  @ApiResponse({ status: 200, description: 'Запис видалено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  @ApiResponse({ status: 404, description: 'Запис не знайдено' })
  delete(@Param('id') id: string) {
    return this.vocabularyService.delete(id);
  }
}
