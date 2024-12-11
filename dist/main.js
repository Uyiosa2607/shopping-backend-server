"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = require("./routes/authRoutes");
const productsRoutes_1 = require("./routes/productsRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 2051;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/auth", authRoutes_1.authRouter);
app.use("/products", productsRoutes_1.productRouter);
app.listen(PORT, () => console.log(`server has started and running on port ${PORT}`));
//# sourceMappingURL=main.js.map