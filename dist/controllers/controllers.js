"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWelcome = handleWelcome;
exports.handleRegistration = handleRegistration;
exports.handleLogin = handleLogin;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Prisma = new client_1.PrismaClient();
function handleWelcome(req, res) {
    console.log(req.body);
    res.status(200).send({ message: "You are welcome" });
}
async function handleRegistration(req, res) {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    try {
        await Prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ message: "registration successfull" });
    }
    catch (error) {
        console.log(error);
        if (error.code === "P2002") {
            res.status(501).json({ error: "email already exists" });
            return;
        }
        else {
            res.status(501).json({ message: "something went wrong" });
        }
        res.status(501).json({ error: error });
    }
}
async function handleLogin(req, res) {
    const { email, password } = req.body;
    try {
        const account = await Prisma.user.findUnique({
            where: { email },
        });
        if (!account) {
            res.status(404).json({ error: "account does not exist" });
            return;
        }
        const match = await bcrypt_1.default.compare(password, account.password);
        if (match) {
            const options = {
                expiresIn: "10m",
            };
            const token = jsonwebtoken_1.default.sign(account, "test-secret-key", options);
            res.status(200).json({
                message: "Login successfull",
                accessToken: token,
                email: account.email,
            });
        }
        else {
            res.status(401).json({ error: "invalid credetials" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(501).json(error);
    }
}
//# sourceMappingURL=controllers.js.map