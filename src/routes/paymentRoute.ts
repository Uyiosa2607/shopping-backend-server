import express from "express";
import { verifyAccessToken } from "../middleware/middlewares";
import {
  initPayment,
  verifyPayment,
  createOrderRecord,
} from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post("/initialize-payment", verifyAccessToken, initPayment);
paymentRouter.get(
  "/verify-payment/:reference",
  verifyAccessToken,
  verifyPayment
);
paymentRouter.post("/payment-webhook", createOrderRecord);

export { paymentRouter };
