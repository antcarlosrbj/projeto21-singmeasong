import { prisma } from "../database.js";

async function deleteAll() {
  await prisma.recommendation.deleteMany();
}

export const testsRepository = {
  deleteAll
};
