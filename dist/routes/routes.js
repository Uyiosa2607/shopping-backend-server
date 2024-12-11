"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers/controllers");
const router = express_1.default.Router();
exports.router = router;
router.get("/", controllers_1.handleWelcome);
router.post("/register", controllers_1.handleRegistration);
router.post("/login", controllers_1.handleLogin);
//# sourceMappingURL=routes.js.map