import { type Request, type Response, type NextFunction } from "express";
import { userService } from "../services/users.service";

export const userController = {
    // POST /users/login
    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: "Bad request! Email or password is required.",
                });
            }

            const result = await userService.authenticate(email, password);

            return res.status(200).json({
                success: true,
                message: "Authentication successful",
                data: {
                    token: result.token,
                    user: result.user,
                },
            });
        } catch (err: unknown) {
            console.error("Login error:", err);
            return next(err);
        }
    },

    // POST /users/signup
    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, username, password } = req.body;

            if (!name || !email || !username || !password) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Bad request! All fields (name, email, username, password) are required.",
                });
            }

            // Delegate to service layer
            const result = await userService.createUser({
                email,
                password,
                name,
                username,
            });

            return res.status(201).json({
                success: true,
                data: {
                    user: result.user,
                    token: result.token,
                },
            });
        } catch (err: unknown) {
            console.error("Signup error:", err);
            return next(err);
        }
    },

    // GET /users/current-user
    async getCurrentUser(req: Request, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - User not authenticated",
                });
            }

            // req.user is set by authentication middleware
            const user = await userService.getUserById(req.user.id);

            return res.status(200).json({
                success: true,
                data: { user },
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}