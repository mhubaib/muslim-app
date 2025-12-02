import { PrismaClient } from '../prisma/default/client.js';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
