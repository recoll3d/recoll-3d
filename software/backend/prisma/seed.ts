import { profiles } from './dev_database/profiles';
import { prisma } from '../src/database/prismaClient';

async function main() {
  for (let profile of profiles) {
    await prisma.profiles.create({
      data: {
        name: profile.name,
        description: profile.description,
        image: profile.image,
      },
    });
  }
}

main().catch(err => {
  console.log(err);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});