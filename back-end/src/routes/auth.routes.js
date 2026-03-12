import { Router } from "express";
import { loginUser, singupUser, verifySignUpVerificationOTP } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.route("/signup").post(singupUser);
authRouter.route("/sign-up/verify").put(verifySignUpVerificationOTP);
authRouter.route("/login").post(loginUser);

export default authRouter;