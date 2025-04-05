import express from "express";
import authRouter from "./routes/authRoutes";
import { productRouter } from "./routes/productsRoutes";
import { paymentRouter } from "./routes/paymentRoute";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./libs/passport";
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

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "none",
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/products", productRouter);

app.use("/api/v1/pay", paymentRouter);

app.listen(PORT, () =>
  console.log(`server has started and running on port ${PORT}`)
);
