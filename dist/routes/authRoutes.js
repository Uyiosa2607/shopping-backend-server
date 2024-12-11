"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const middlewares_1 = require("../middleware/middlewares");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.get("/", middlewares_1.verifyAdminAccessAndToken, authControllers_1.handleWelcome);
authRouter.post("/register", authControllers_1.handleRegistration);
authRouter.post("/login", authControllers_1.handleLogin);
authRouter.post("/token", middlewares_1.verifyAccessToken, authControllers_1.generateAcessToken);
//# sourceMappingURL=authRoutes.js.map