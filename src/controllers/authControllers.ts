import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Account {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export const Prisma = new PrismaClient();

function generateRefreshToken(user: Account) {
  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_KEY!);
  return refreshToken;
}

function handleWelcome(req: Request, res: Response): void {
  console.log(req.body);
  res.status(200).send({ message: "You are welcome" });
}

// generate access token
async function generateAcessToken(req: Request, res: Response): Promise<void> {
  // const options = {
  //   expiresIn: "10m",
  // };

  try {
    res.status(200).json(req.body);
  } catch (error) {
    console.log(error);
    res.status(501);
  }
}

// handles registration
async function handleRegistration(req: Request, res: Response) {
  const { email, password, name } = req.body;

  //plain password provided is hashed
  const hashedPassword = await bcrypt.hash(password, 10);

  //the user name, email and the hashed password is stored in database
  try {
    await Prisma.user.create({
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

// handles login/authentication

async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    //finds the user account from db with email
    const user = await Prisma.user.findUnique({
      where: { email },
    });

    //if no account is found a not found message is sent back
    if (!user) {
      res.status(404).json({ error: "account does not exist" });
      return;
    }

    //if account exist the hashed password from db is compared to the password submited, if the match is positive an access token is generated and sent to the user
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const options = {
        expiresIn: "10m",
      };

      //prevents the user password from being sent back to client
      const { password, ...account } = user;

      //creates an access token with the user account object
      const token = jwt.sign(account, process.env.JWT_SECRET_KEY!, options);

      const refreshToken = generateRefreshToken(user);

      //returns response with the user email and access tokens with a login successfull message
      res.status(200).json({
        message: "Login successfull",
        accessToken: token,
        refreshToken: refreshToken,
        user: account,
      });
      return;

      //if passwords do not match returns a error message
    } else {
      res.status(401).json({ error: "invalid credentials" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
}

async function handleLogout() {}

export { handleWelcome, handleRegistration, handleLogin, generateAcessToken };