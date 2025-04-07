import express from "express";
import {
  getAllProducts,
  addProduct,
  findProduct,
  updateProduct,
  removeProduct,
} from "../controllers/productControllers";
import passport from "../libs/passport";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);

productRouter.get(
  "/items",
  passport.authenticate("jwt", { session: false }),
  findProduct
);

productRouter.post(
  "/add-product",
  passport.authenticate("jwt", { session: false }),
  addProduct
);

productRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateProduct
);

productRouter.delete(
  "/remove",
  passport.authenticate("jwt", { session: false }),
  removeProduct
);

export default productRouter;
