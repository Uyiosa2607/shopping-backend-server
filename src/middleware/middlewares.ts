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
): void {
  const token = req.cookies["accessToken"];
  if (!token) {
    res.status(401).json({ error: "not authorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as Decoded;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "invalid access token" });
  }
}

// Middleware to verify admin access and token
// function verifyAdminAccessAndToken(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   const token = req.cookies["accessToken"];
//   if (!token) {
//     res
//       .status(401)
//       .json({ error: "access denied, only admin can perform such operations" });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as Decoded;

//     if (decoded.isAdmin !== true) {
//       res.status(403).json({
//         error: "Access denied! Admin privileges required",
//       });
//       return;
//     }
//     req.user = decoded;
//     next();
//   } catch (error: any) {
//     console.log({
//       error: error.message,
//     });
//     res.status(403).json({ error: "invalid access token" });
//     return;
//   }
// }

//middleware to check and verify refresh token
function verifyRefreshToken(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies["refreshToken"];
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);
      req.user = decoded;
      next();
      return;
    } catch (error) {
      res.status(403).json({ error: "invalid or expired access token" });
      return;
    }
  } else {
    res.status(401).json({ error: "invalid refresh token" });
    return;
  }
}

export { verifyAccessToken, verifyRefreshToken };
