import express from "express";
import { authRouter } from "./routes/authRoutes";
import { productRouter } from "./routes/productsRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 2051;

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);

app.listen(PORT, () =>
  console.log(`server has started and running on port ${PORT}`)
);
