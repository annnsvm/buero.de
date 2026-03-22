import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const where: Prisma.VocabularyWhereInput = search
      ? {
          OR: [
            { word: { contains: search, mode: 'insensitive' } },
            { translation: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.prisma.vocabulary.findMany({
      where,
      orderBy: { word: 'asc' },
    });
  }

  async findById(id: string) {
    const entry = await this.prisma.vocabulary.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Vocabulary entry not found');
    return entry;
  }

  async create(dto: CreateVocabularyDto) {
    try {
      return await this.prisma.vocabulary.create({
        data: {
          word: dto.word,
          translation: dto.translation,
          pronunciation: dto.pronunciation,
          exampleSentence: dto.example_sentence,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Word "${dto.word}" already exists in the vocabulary`,
        );
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateVocabularyDto) {
    await this.findById(id);

    try {
      return await this.prisma.vocabulary.update({
        where: { id },
        data: {
          ...(dto.word !== undefined && { word: dto.word }),
          ...(dto.translation !== undefined && { translation: dto.translation }),
          ...(dto.pronunciation !== undefined && {
            pronunciation: dto.pronunciation,
          }),
          ...(dto.example_sentence !== undefined && {
            exampleSentence: dto.example_sentence,
          }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Word "${dto.word}" already exists in the vocabulary`,
        );
      }
      throw error;
    }
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.vocabulary.delete({ where: { id } });
  }
}
