import express from "express";
import { authRouter } from "./routes/authRoutes";
import { productRouter } from "./routes/productsRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 2051;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.use("/products", productRouter);

app.listen(PORT, () =>
  console.log(`server has started and running on port ${PORT}`)
);
