import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('db')
  async getDbHealth() {
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      return {
        database: 'ok',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Health] Database health check failed', error);
      throw new HttpException(
        {
          database: 'error',
          message: (error as Error).message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}

