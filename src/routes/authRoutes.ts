import express from "express";
import {
  handleWelcome,
  handleRegistration,
  handleLogin,
  generateAcessToken,
} from "../controllers/authControllers";

import {
  verifyAccessToken,
  verifyAdminAccessAndToken,
} from "../middleware/middlewares";

const authRouter = express.Router();

authRouter.get("/", verifyAdminAccessAndToken, handleWelcome);

authRouter.post("/register", handleRegistration);

authRouter.post("/login", handleLogin);

authRouter.post("/token", verifyAccessToken, generateAcessToken);

export { authRouter };
