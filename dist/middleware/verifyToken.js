"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = verifyAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
        try {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
                if (error) {
                    res.status(401).json({ error: "invalid access token" });
                    return;
                }
                req.user = decoded;
                console.log("req.user:", req.user);
                next();
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "internal server error" });
            return;
        }
    }
    else {
        res.status(401).json({ message: "not authorized" });
        return;
    }
}
function verifyAdminAccess(req, res, next) {
    verifyAccessToken(req, res, next);
}
//# sourceMappingURL=verifyToken.js.map