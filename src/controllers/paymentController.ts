import { Request, Response } from "express";
import axios from "axios";

async function initPayment(req: Request, res: Response): Promise<any> {
  let { email, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        // callback_url: `http://localhost:3000/payment-status`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function verifyPayment(req: Request, res: Response): Promise<any> {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "something went wrong, internal server error" });
  }
}

export { initPayment, verifyPayment };
