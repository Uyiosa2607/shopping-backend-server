import express, { Request, Response } from "express";
import authRouter from "./routes/authRoutes";
import productRouter from "./routes/productsRoutes";
import { paymentRouter } from "./routes/paymentRoute";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./libs/passport";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import cors from "cors";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["https://kultra-devices.vercel.app", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 2051;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = createClient({
  url: process.env.REDIS_URL,
  // legacyMode: true,
});

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      sameSite: "lax",
      httpOnly: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/pay", paymentRouter);

app.listen(PORT, () =>
  console.log(`Server has started and running on port ${PORT}`)
);
