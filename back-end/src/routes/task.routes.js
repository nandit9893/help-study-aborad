import { Router } from "express";
import verifyUserJWT from "../middlewares/auth.middlewares.js";
import { createTask, getAllTaskLoggedInUser } from "../controllers/task.controllers.js";

const taskRouter = Router();

taskRouter.route("/").post(verifyUserJWT, createTask);
taskRouter.route("/").get(verifyUserJWT, getAllTaskLoggedInUser);

export default taskRouter;