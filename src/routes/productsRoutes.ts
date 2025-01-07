import express from "express";
import {
  getAllProducts,
  addProduct,
  findProduct,
  updateProduct,
  removeProduct,
} from "../controllers/productControllers";
import { verifyAccessToken } from "../middleware/middlewares";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);

productRouter.get("/items", verifyAccessToken, findProduct);

productRouter.post("/add-product", verifyAccessToken, addProduct);

productRouter.patch("/:id", verifyAccessToken, updateProduct);

productRouter.delete("/remove", verifyAccessToken, removeProduct);

export { productRouter };
