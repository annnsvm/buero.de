/**
 * Optional seed for DB verification (docs/architecture.md).
 * Run: npx prisma db seed
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Ensure placement_questions table is writable (one placeholder question)
  const count = await prisma.placementQuestion.count();
  if (count === 0) {
    await prisma.placementQuestion.create({
      data: {
        level: 'A1',
        questionData: {
          text: 'Placeholder question for schema verification',
          options: ['A', 'B', 'C'],
          correctAnswer: 'A',
        },
        orderIndex: 0,
      },
    });
    console.log('[Seed] Created placeholder placement_question.');
  } else {
    console.log('[Seed] placement_questions already has data, skip.');
  }
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
