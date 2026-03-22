import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyService } from './vocabulary.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [VocabularyController],
  providers: [VocabularyService],
})
export class VocabularyModule {}
