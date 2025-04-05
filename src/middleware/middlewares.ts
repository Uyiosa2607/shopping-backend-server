import { Response, Request, NextFunction } from "express";

function verifyAuthentication(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).json("unathorized");
}

// async function checkAdminAccess(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> {
//   if (!req.isAuthenticated()) return res.status(401).json("not authorized");
//   try {
//     const user = await Prisma.users.findUnique({
//       where: { email: req.user?.email },
//     });
//     if (user?.isAdmin !== true) {
//       return res
//         .status(403)
//         .json("access denied, only admins can access function");
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json("something went wrong, internal server error!");
//   }
// }

export { verifyAuthentication };
