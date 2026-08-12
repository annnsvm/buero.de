import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

function createPgAdapter(connectionString: string): PrismaPg {
  // Render External Database URL requires SSL from outside Render's network.
  const useSsl =
    connectionString.includes('.render.com') ||
    /sslmode=(require|verify-full|verify-ca)/i.test(connectionString);

  return new PrismaPg({
    connectionString,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not set. Please configure it in your .env file.',
      );
    }

    const adapter = createPgAdapter(connectionString);
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('[Prisma] Connected to PostgreSQL');
    } catch (error) {
      console.error('[Prisma] Failed to connect to PostgreSQL', error);
      throw error;
    }
  }

}

