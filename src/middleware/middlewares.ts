import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Decoded | any;
    }
  }
}

interface Decoded {
  id: string;
  isAdmin: boolean;
  email: string;
}

// Middleware to verify access token
function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const token = req.cookies["accessToken"];
  if (!token) {
    return res.status(401).json({ error: "not authorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as Decoded;
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ error: "invalid access token" });
  }
}

//middleware to check and verify refresh token
function verifyRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const refreshToken = req.cookies["refreshToken"];
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(403).json({ error: "invalid or expired access token" });
    }
  } else {
    return res.status(401).json({ error: "invalid refresh token" });
  }
}

export { verifyAccessToken, verifyRefreshToken };
