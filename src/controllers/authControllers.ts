import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Prisma } from "../libs/prisma";

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

  //the user name, email and the hashed password is stored in database
  try {
    await Prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    //sends a registration successfull message if db operation is succesfull
    res.status(201).json({ message: "registration successfull" });
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

function checkAuthStatus(req: Request, res: Response): any {
  if (!req.isAuthenticated()) return res.redirect("/login");
  return res.sendStatus(200);
}

function handleLogin(req: Request, res: Response): any {
  res.status(200).json({
    id: req.user?.id,
    email: req.user?.email,
    isAdmin: req.user?.isAdmin,
  });
}

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

export { handleLogin, handleLogout, handleRegistration, checkAuthStatus };
