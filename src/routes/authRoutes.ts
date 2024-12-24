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
  verifyRefreshToken,
} from "../middleware/middlewares";

const authRouter = express.Router();

// authRouter.get("/", verifyAdminAccessAndToken, handleWelcome);

authRouter.post("/register", handleRegistration);

authRouter.post("/login", handleLogin);

authRouter.get("/refresh-token", verifyRefreshToken, generateAcessToken);

export { authRouter };
