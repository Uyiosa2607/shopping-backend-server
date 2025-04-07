import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRegistration,
  checkAuthStatus,
  verifyAccount,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers";

const authRouter = express.Router();

authRouter.post("/login", handleLogin);
authRouter.post("/register", handleRegistration);
authRouter.get("/auth-status", checkAuthStatus);
authRouter.post("/logout", handleLogout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.get("/verify-email", verifyAccount);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
