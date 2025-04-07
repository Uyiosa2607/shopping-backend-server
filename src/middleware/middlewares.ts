import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

async function verifyRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    return res.status(403).json("not authorized");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY!
    ) as Express.User;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
}

export { verifyRefreshToken };
