import express from "express";
import {
  getAllProducts,
  addProduct,
  findProduct,
  updateProduct,
  removeProduct,
} from "../controllers/productControllers";
import {
  verifyAdminAccessAndToken,
  verifyAccessToken,
} from "../middleware/middlewares";

const productRouter = express.Router();

productRouter.get("/", verifyAccessToken, getAllProducts);

productRouter.get("/items", verifyAccessToken, findProduct);

productRouter.post("/add-product", verifyAdminAccessAndToken, addProduct);

productRouter.patch("/:id", verifyAdminAccessAndToken, updateProduct);

productRouter.delete("/remove", verifyAdminAccessAndToken, removeProduct);

export { productRouter };
