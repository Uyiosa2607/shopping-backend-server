import express from "express";
import {
  getAllProducts,
  addProduct,
  findProduct,
  updateProduct,
  removeProduct,
} from "../controllers/productControllers";
import { verifyAuthentication } from "../middleware/middlewares";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);

productRouter.get("/items", verifyAuthentication, findProduct);

productRouter.post("/add-product", verifyAuthentication, addProduct);

productRouter.patch("/:id", verifyAuthentication, updateProduct);

productRouter.delete("/remove", verifyAuthentication, removeProduct);

export default productRouter;
