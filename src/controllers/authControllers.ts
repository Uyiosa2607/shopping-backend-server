import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Account {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const Prisma = new PrismaClient();

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

//function to validate auth status
async function getAuthStatus(req: Request, res: Response): Promise<any> {
  const userUID = req?.user?.uid;
  try {
    const user = await Prisma.users.findUnique({
      where: { id: userUID },
      select: { name: true, email: true, id: true, isAdmin: true },
    });
    return res.status(200).json({ user, authenticated: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "something went wrong! internal server error" });
  }
}

//get user
async function handleGetUser(req: Request, res: Response): Promise<any> {
  const userId = req.query.user_id as string;
  try {
    const findUser = await Prisma.users.findUnique({
      where: { id: userId },
    });
    if (findUser) {
      const { password, ...userDetails } = findUser;
      return res.status(200).json(userDetails);
    } else {
      return res
        .status(404)
        .json("no user found, user with provided id does not exit");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("something went wrong, internal server error");
  }
}

// generate access token
async function generateAcessToken(
  req: Request,
  res: Response
): Promise<any | string[]> {
  const options = {
    expiresIn: "30m",
  };

  //signs the jwt token with the user id, email and role
  try {
    const accessToken = jwt.sign(
      {
        email: req.user?.email,
        uid: req.user.uid,
        isAdmin: req.user?.isAdmin,
        method: "token",
      },
      process.env.JWT_SECRET_KEY!,
      options
    );
    //sends back new access token
    console.log("token refresh response was received");
    res.cookie("accessToken", accessToken, {
      maxAge: 1800 * 1000,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({ message: "access token refreshed" });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error: "internal server error" });
  }
}

// handles registration
async function handleRegistration(req: Request, res: Response): Promise<any> {
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
    return res.status(201).json("registration successfull");
  } catch (error) {
    console.log(error);
    //if error it checks for the "P2002" error which means the email already exist in db then sends back email already exist back to client
    if (error.code === "P2002") {
      res.status(501).json("email already exists");
    } else {
      res.status(500).json("something went wrong");
    }
    return res.status(501).json("internal server error");
  }
}

// handles login/authentication

async function handleLogin(req: Request, res: Response): Promise<any> {
  const { email, password } = req.body;

  try {
    //finds the user account from db with email
    const user = await Prisma.users.findUnique({
      where: { email },
    });

    //if no account is found a not found message is sent back
    if (!user) {
      return res.status(404).json("account does not exist");
    }

    //if account exist the hashed password from db is compared to the password submited, if the match is positive an access token is generated and sent to the user
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (passwordMatched) {
      const options = {
        expiresIn: "30m",
      };

      //creates an access token with the user account object
      const accessToken = jwt.sign(
        {
          email: user?.email,
          uid: user?.id,
          isAdmin: user?.isAdmin,
          method: "auth",
        },
        process.env.JWT_SECRET_KEY!,
        options
      );

      //prevents the hashed password from being sent back to the frontend
      const { password, ...userDatails } = user;

      // creates refresh token
      const refreshToken = generateRefreshToken(userDatails);

      //sets access token to a cookie named accessToken
      res.cookie("accessToken", accessToken, {
        maxAge: 1800 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });

      //sets refresh token to a cookie
      res.cookie("refreshToken", refreshToken, {
        maxAge: 86400000,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });

      //finaly returns a 200 status code including the uid and email of the authenticated user
      return res.status(200).json({
        message: "Login successfull",
        email: user?.email,
        uid: user?.id,
      });

      //if passwords do not match returns a error message
    } else {
      return res.status(401).json("invalid credentials");
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "something went wrong, internal server error" });
  }
}

//logout route, removes auth token from client browser
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
  handleRegistration,
  handleLogin,
  generateAcessToken,
  getAuthStatus,
  handleLogout,
  handleGetUser,
};
