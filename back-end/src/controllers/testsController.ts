import { Request, Response } from "express";
import { testsService } from "../services/testsService.js";

async function deleteAll(req: Request, res: Response) {
  await testsService.deleteAll();
  res.sendStatus(200);
}

export const testsController = {
  deleteAll
};
