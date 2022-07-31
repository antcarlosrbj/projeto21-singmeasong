import { Router } from "express";
import { testsController } from "../controllers/testsController.js";

const testsRouter = Router();

if(process.env.NODE_ENV === "test") {
    testsRouter.post("/reset", testsController.deleteAll);
}

export default testsRouter;
