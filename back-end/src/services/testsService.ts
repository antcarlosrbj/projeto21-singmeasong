import { testsRepository } from "../repositories/testsRepository.js";


async function deleteAll() {
  await testsRepository.deleteAll();
}

export const testsService = {
  deleteAll
};
