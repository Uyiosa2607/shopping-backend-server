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
  name: string;
  isAdmin: boolean;
  email: string;
}

// Middleware to verify access token
function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "not authorized" });
    return;
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY!);
    next();
  } catch (error) {
    res.status(403).json({ error: "invalid access token" });
  }
}

// Middleware to verify admin access and token
function verifyAdminAccessAndToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as Decoded;

    if (decoded.isAdmin !== true) {
      res.status(403).json({
        error: "Access denied: Admin privileges required",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    console.log({
      error: error.message,
    });
    res.status(403).json({ error: "invalid access token" });
    return;
  }
}

export { verifyAccessToken, verifyAdminAccessAndToken };
