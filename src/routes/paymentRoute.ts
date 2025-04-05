import express from "express";
import { verifyAuthentication } from "../middleware/middlewares";
import {
  initPayment,
  verifyPayment,
  createOrderRecord,
} from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post("/initialize-payment", verifyAuthentication, initPayment);
paymentRouter.get(
  "/verify-payment/:reference",
  verifyAuthentication,
  verifyPayment
);
paymentRouter.post("/payment-webhook", createOrderRecord);

export { paymentRouter };
