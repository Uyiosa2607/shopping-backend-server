import express from "express";
import {
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

//handles registration endpoint
authRouter.post("/register", handleRegistration);

//handles login endpoint
authRouter.post("/login", handleLogin);

//handles refresh token endpoint
authRouter.get("/refresh-token", verifyRefreshToken, generateAcessToken);

export { authRouter };
