import express from "express";
import {
  handleRegistration,
  handleLogin,
  generateAcessToken,
  getAuthStatus,
  handleLogout,
} from "../controllers/authControllers";

import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middleware/middlewares";

const authRouter = express.Router();

// authRouter.get("/", verifyAdminAccessAndToken, handleWelcome);

//verifies user auth status
authRouter.get("/get-auth", verifyAccessToken, getAuthStatus);

//handles registration endpoint
authRouter.post("/register", handleRegistration);

//handles login endpoint
authRouter.post("/login", handleLogin);

//handles refresh token endpoint
authRouter.get("/refresh-token", verifyRefreshToken, generateAcessToken);

authRouter.get("/signout", handleLogout);

export { authRouter };
