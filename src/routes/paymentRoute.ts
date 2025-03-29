import express from "express";
import { verifyAccessToken } from "../middleware/middlewares";
import { initPayment, verifyPayment } from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post("/initialize-payment", verifyAccessToken, initPayment);
paymentRouter.get(
  "/verify-payment/:reference",
  verifyAccessToken,
  verifyPayment
);

export { paymentRouter };
