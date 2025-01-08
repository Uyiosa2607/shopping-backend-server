import express from "express";
import { authRouter } from "./routes/authRoutes";
import { productRouter } from "./routes/productsRoutes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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

app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);

app.listen(PORT, () =>
  console.log(`server has started and running on port ${PORT}`)
);
