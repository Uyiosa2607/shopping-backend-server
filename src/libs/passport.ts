import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Prisma } from "../utils/prisma";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await Prisma.users.findUnique({ where: { email } });
        if (!user)
          return done(null, false, { message: "Account does not exist" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
          return done(null, false, { message: "Invalid credentials" });
        return done(null, user);
      } catch (error) {
        console.error("Login error:", error);
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  try {
    const user = await Prisma.users.findUnique({ where: { email } });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport;
