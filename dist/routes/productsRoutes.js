"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const productControllers_1 = require("../controllers/productControllers");
const middlewares_1 = require("../middleware/middlewares");
const productRouter = express_1.default.Router();
exports.productRouter = productRouter;
productRouter.get("/", middlewares_1.verifyAccessToken, productControllers_1.getAllProducts);
productRouter.get("/items", middlewares_1.verifyAccessToken, productControllers_1.findProduct);
productRouter.post("/add-product", middlewares_1.verifyAdminAccessAndToken, productControllers_1.addProduct);
productRouter.patch("/:id", middlewares_1.verifyAdminAccessAndToken, productControllers_1.updateProduct);
productRouter.delete("/remove", middlewares_1.verifyAdminAccessAndToken, productControllers_1.removeProduct);
//# sourceMappingURL=productsRoutes.js.map