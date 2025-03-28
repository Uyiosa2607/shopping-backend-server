import express from "express";
import { verifyAccessToken } from "../middleware/middlewares";
import { handlePayment } from "../controllers/paymentController";

const paymentRouter = express.Router();

paymentRouter.post("/initialize-payment", verifyAccessToken, handlePayment);

export { paymentRouter };
