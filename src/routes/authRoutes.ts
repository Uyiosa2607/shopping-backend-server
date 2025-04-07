import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRegistration,
  checkAuthStatus,
  verifyAccount,
  forgotPassword,
  resetPassword,
  generateAcessToken,
} from "../controllers/authControllers";
import { verifyRefreshToken } from "../middleware/middlewares";
import passport from "../libs/passport";

const authRouter = express.Router();

authRouter.post("/login", handleLogin);
authRouter.post("/register", handleRegistration);
authRouter.get(
  "/auth-status",
  passport.authenticate("jwt", { session: false }),
  checkAuthStatus
);
authRouter.post("/logout", handleLogout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.get("/verify-email", verifyAccount);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/refresh-token", verifyRefreshToken, generateAcessToken);

export default authRouter;
