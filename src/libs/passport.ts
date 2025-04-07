import passport from "passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { Prisma } from "../utils/prisma";

const cookieExtractor = function (req: Request) {
  return req.cookies?.accessToken || null;
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
      if (!user) return done(null, false);
      if (user?.isVerified !== true) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
