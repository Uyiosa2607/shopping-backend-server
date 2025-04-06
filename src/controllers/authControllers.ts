import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Prisma } from "../utils/prisma";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer";

declare global {
  namespace Express {
    interface User {
      email: string;
      id: string;
      isAdmin: boolean;
    }
  }
}

async function handleRegistration(req: Request, res: Response) {
  const { email, password, name } = req.body;

  //plain password provided is hashed
  const hashedPassword = await bcrypt.hash(password, 10);

  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

  //the user name, email and the hashed password is stored in database
  try {
    await Prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken: token,
        verificationExpires: tokenExpiry,
      },
    });

    const verificationUrl = `http://localhost:4001/api/v1/auth/verify-email?token=${token}`;
    const html = `<p>Welcome! Please confirm your email:</p>
                  <a href="${verificationUrl}">Verify Email</a>`;

    await sendEmail(email, "Confirm your Email", html);

    //sends a registration successfull message if db operation is succesfull
    res.status(201).json({
      message:
        "registration successfull, please check your email for verification",
    });
  } catch (error) {
    console.log(error);
    //if error it checks for the "P2002" error which means the email already exist in db then sends back email already exist back to client
    if (error.code === "P2002") {
      res.status(501).json({ error: "email already exists" });
      return;
    } else {
      res.status(501).json({ message: "something went wrong" });
    }
    res.status(501).json({ error: error });
    return;
  }
}

//End point function to get auth status / check auth status
function checkAuthStatus(req: Request, res: Response): any {
  if (!req.isAuthenticated()) return res.redirect("/login");
  return res.sendStatus(200);
}

//function to handle login/ authentication
function handleLogin(req: Request, res: Response): any {
  res.status(200).json({
    id: req.user?.id,
    email: req.user?.email,
    isAdmin: req.user?.isAdmin,
  });
}

//endpoint to handleForgot password

async function forgotPassword(req: Request, res: Response): Promise<any> {
  const { email } = req.body;
  try {
    const user = await Prisma.users.findUnique({
      where: { email },
    });
    if (!user)
      return res.json("If your email exists, a reset link has been sent.");

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 mins

    await Prisma.users.update({
      where: { email },
      data: { resetToken: token, resetExpires: expires },
    });

    const resetUrl = `http://localhost:4001/api/v1/auth/reset-password?token=${token}`;
    const html = `<p>Click to reset your password: <a href="${resetUrl}">Reset Password</a></p>`;

    await sendEmail(email, "Password Reset Request", html);

    return res.send("If your email exists, a reset link has been sent.");
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error!");
  }
}

//function to reset user password
async function resetPassword(req: Request, res: Response): Promise<any> {
  const { token, newPassword } = req.body;
  try {
    const user = await Prisma.users.findFirst({
      where: { resetToken: token, resetExpires: { gt: new Date() } },
    });
    if (!user) return res.json("Token is invalid or expired.");

    const hashed = await bcrypt.hash(newPassword, 10);

    await Prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetExpires: null,
      },
    });

    res.status(200).json("password has been updated");
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
}

//function to verify email / account
async function verifyAccount(req: Request, res: Response): Promise<any> {
  const token = String(req.query?.token);
  try {
    const user = await Prisma.users.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: { gt: new Date() },
      },
    });

    if (!user) return res.status(400).send("Token is invalid or expired.");
    await Prisma.users.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    res.send("✅ Email verified! You can now log in.");
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
}

//handles logout ...deletion of user session data
function handleLogout(req: Request, res: Response): void {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      res.status(500).json({ message: "Error logging out" });
      return;
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        res.status(500).json({ message: "Failed to destroy session" });
        return;
      }

      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
}

export {
  handleLogin,
  handleLogout,
  handleRegistration,
  checkAuthStatus,
  verifyAccount,
  forgotPassword,
  resetPassword,
};
