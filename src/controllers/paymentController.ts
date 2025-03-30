import { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";
import { Prisma } from "./authControllers";

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
// function to verify payment status from paystack
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

//function to create order record if the payment was succesfull
async function createOrderRecord(req: Request, res: Response): Promise<any> {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  //verify paystack signature
  const hash = crypto
    .createHmac("sha512", secret!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(400).json({ message: "invalid signature" });
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const { reference, amount, customer, metadata } = event.data;
    const items = metadata?.items || [];

    try {
      const existingOrder = await Prisma.orders.findUnique({
        where: { reference },
      });

      if (existingOrder) {
        // If order exists and was pending, update it
        if (existingOrder.status === "pending") {
          await Prisma.orders.update({
            where: { reference },
            data: { status: "paid" },
          });
        }
      } else {
        // If order doesn't exist, create a new one
        await Prisma.orders.create({
          data: {
            reference,
            amount: Number(amount / 100), // Convert Kobo to Naira
            email: customer.email,
            status: "paid",
            items,
          },
        });
      }

      return res.sendStatus(200);
    } catch (error) {
      console.log("error occured trying to store data", error);
      res.status(500).json("Error storing order");
    }
  }

  res.sendStatus(200);
}

export { initPayment, verifyPayment, createOrderRecord };
