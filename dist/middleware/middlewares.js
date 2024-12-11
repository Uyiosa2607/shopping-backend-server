"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = verifyAccessToken;
exports.verifyAdminAccessAndToken = verifyAdminAccessAndToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "not authorized" });
        return;
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        next();
    }
    catch (error) {
        res.status(403).json({ error: "invalid access token" });
    }
}
function verifyAdminAccessAndToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(401);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded.isAdmin !== true) {
            res.status(403).json({
                error: "Access denied: Admin privileges required",
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log({
            error: error.message,
        });
        res.status(403).json({ error: "invalid access token" });
        return;
    }
}
//# sourceMappingURL=middlewares.js.map