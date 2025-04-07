import passport from "passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { Prisma } from "../utils/prisma";

const cookieExtractor = function (req: Request) {
  return req.cookies?.token || null;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await Prisma.users.findUnique({
        where: { email: payload.email },
      });
      if (user) return done(null, user);
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// passport.serializeUser((user: any, done) => {
//   done(null, user.email);
// });

// passport.deserializeUser(async (email: string, done) => {
//   try {
//     const user = await Prisma.users.findUnique({ where: { email } });
//     done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// });

export default passport;
