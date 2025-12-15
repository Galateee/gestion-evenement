import { PrismaClient, RoleName } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: RoleName.ADMIN },
      { name: RoleName.ORGANIZER },
      { name: RoleName.PARTICIPANT },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Roles seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
