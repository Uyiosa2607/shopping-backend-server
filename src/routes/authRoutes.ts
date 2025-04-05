import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRegistration,
  checkAuthStatus,
} from "../controllers/authControllers";
import passport from "../libs/passport";

const authRouter = express.Router();

authRouter.post("/login", passport.authenticate("local"), handleLogin);
authRouter.post("/register", handleRegistration);
authRouter.get("/auth-status", checkAuthStatus);
authRouter.post("/logout", handleLogout);

export default authRouter;
