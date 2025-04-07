import express from "express";
import {
  initPayment,
  verifyPayment,
  createOrderRecord,
} from "../controllers/paymentController";
import passport from "../libs/passport";

const paymentRouter = express.Router();

paymentRouter.post(
  "/initialize-payment",
  passport.authenticate("jwt", { session: false }),
  initPayment
);
paymentRouter.get(
  "/verify-payment/:reference",
  passport.authenticate("jwt", { session: false }),
  verifyPayment
);
paymentRouter.post("/payment-webhook", createOrderRecord);

export { paymentRouter };
