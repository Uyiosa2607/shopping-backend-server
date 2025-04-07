import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Prisma } from "../utils/prisma";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface User {
      email: string;
      id: string;
      isAdmin: boolean;
    }
  }
}

interface Account {
  email: string;
  id: string;
  isAdmin: boolean;
}

//function to generate refresh token without expiry date
function generateRefreshToken(user: Account): string {
  const options = {
    expiresIn: "1d",
  };
  const refreshToken = jwt.sign(
    { email: user?.email, uid: user?.id, isAdmin: user?.isAdmin },
    process.env.JWT_REFRESH_KEY!,
    options
  );
  return refreshToken;
}

//handles creation of new user
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
async function checkAuthStatus(req: Request, res: Response): Promise<any> {
  if (!req.isAuthenticated()) return res.status(403).json("not authorized");
  return res.sendStatus(200);
}

//function to handle login/ authentication
async function handleLogin(req: Request, res: Response): Promise<any> {
  const { email, password } = req.body;

  try {
    const user = await Prisma.users.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Account does not exist" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "6h",
      }
    );

    res.cookie("accessToken", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 5 * 60 * 60 * 1000,
    });

    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error!,something went wrong");
  }
}

async function generateAcessToken(
  req: Request,
  res: Response
): Promise<any | string[]> {
  const options = {
    expiresIn: "6h",
  };

  //signs the jwt token with the user id, email and role
  try {
    const accessToken = jwt.sign(
      {
        email: req.user?.email,
        id: req.user?.id,
        isAdmin: req.user?.isAdmin,
      },
      process.env.JWT_SECRET!,
      options
    );

    const refreshToken = jwt.sign(
      {
        email: req.user?.email,
        id: req.user?.id,
        isAdmin: req.user?.isAdmin,
      },
      process.env.JWT_REFRESH_KEY!,
      { expiresIn: "1d" }
    );
    //sends back new access token
    console.log("token refresh response was received");

    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "access token refreshed" });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error: "internal server error" });
  }
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
async function handleLogout(req: Request, res: Response): Promise<any> {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "internal server error, something went wrong" });
  }
  return res.status(200).json({ message: "logout successfull" });
}

export {
  handleLogin,
  handleLogout,
  handleRegistration,
  checkAuthStatus,
  verifyAccount,
  forgotPassword,
  resetPassword,
  generateAcessToken,
};
