const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const teams = await prisma.team.findMany();
  console.log("Teams:", teams);
  const orgs = await prisma.organization.findMany();
  console.log("Orgs:", orgs);
}
main().finally(() => prisma.$disconnect());
