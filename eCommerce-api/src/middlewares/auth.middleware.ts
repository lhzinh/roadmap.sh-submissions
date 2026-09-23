import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import env from "../config/env";
import type { User } from "../types/express";

export const jwtMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }

    jwt.verify(token, env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user as User;
        next();
    });
};
