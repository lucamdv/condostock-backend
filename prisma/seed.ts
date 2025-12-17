import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  // Criar Síndico
  await prisma.resident.upsert({
    where: { email: 'sindico@condo.com' },
    update: {},
    create: {
      name: 'Síndico Geraldo',
      email: 'sindico@condo.com',
      password: password,
      role: 'ADMIN',
      apartment: '100',
      block: 'A',
      phone: '999999999',
      isMainTenant: true,
      approved: true,
      account: {
        create: { balance: 0, status: 'ACTIVE' }
      }
    },
  });

  console.log('🌱 Banco semeado com o Síndico!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());