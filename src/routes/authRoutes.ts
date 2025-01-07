import express from "express";
import {
  handleRegistration,
  handleLogin,
  generateAcessToken,
  getAuthStatus,
  handleLogout,
  handleGetUser,
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

//sign out route
authRouter.get("/signout", handleLogout);

//route to get get user details with the user_id query
authRouter.get("/users", handleGetUser);

export { authRouter };
