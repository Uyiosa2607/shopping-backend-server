import { Request, Response } from "express";
import axios from "axios";

async function handlePayment(req: Request, res: Response): Promise<any> {
  let { email, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { email, amount: amount * 100 },
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

async function verifyPayment(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
  }
}

export { handlePayment, verifyPayment };
