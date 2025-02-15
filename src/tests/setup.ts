import { PrismaClient } from '@prisma/client';

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect();
}); 