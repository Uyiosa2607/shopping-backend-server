"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = void 0;
exports.handleWelcome = handleWelcome;
exports.handleRegistration = handleRegistration;
exports.handleLogin = handleLogin;
exports.generateAcessToken = generateAcessToken;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.Prisma = new client_1.PrismaClient();
function generateRefreshToken(user) {
    const refreshToken = jsonwebtoken_1.default.sign(user, process.env.JWT_REFRESH_KEY);
    return refreshToken;
}
function handleWelcome(req, res) {
    console.log(req.body);
    res.status(200).send({ message: "You are welcome" });
}
async function generateAcessToken(req, res) {
    try {
        res.status(200).json(req.body);
    }
    catch (error) {
        console.log(error);
        res.status(501);
    }
}
async function handleRegistration(req, res) {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    try {
        await exports.Prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
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
        return;
    }
}
async function handleLogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await exports.Prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(404).json({ error: "account does not exist" });
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (match) {
            const options = {
                expiresIn: "10m",
            };
            const { password, ...account } = user;
            const token = jsonwebtoken_1.default.sign(account, process.env.JWT_SECRET_KEY, options);
            const refreshToken = generateRefreshToken(user);
            res.status(200).json({
                message: "Login successfull",
                accessToken: token,
                refreshToken: refreshToken,
                user: account,
            });
            return;
        }
        else {
            res.status(401).json({ error: "invalid credentials" });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
}
async function handleLogout() { }
//# sourceMappingURL=authControllers.js.map