import argon2 from "argon2";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { userRepository } from "../repositories/user.repository";

export const userService = {
    // Create a new user account
    async createUser({
        email,
        password,
        name,
        username,
    }: {
        email: string;
        password: string;
        name: string;
        username: string;
    }) {
        // Hash password before storing
        const pwdHash = await argon2.hash(password);

        // Create user in database
        const user = await userRepository.create({
            name,
            email,
            username,
            password: pwdHash,
        });

        // Generate authentication token
        const token = this.generateToken(user);

        // Send welcome email asynchronously
        // Do not await to avoid blocking the response
        // emailService.sendWelcomeEmail(user.email, user.name).catch((err) => {
        //     // Log error but do not fail the request
        //     console.error("Failed to send welcome email:", err);
        // });

        return {
            user: this.sanitizeUser(user),
            token,
        };
    },

    // Get user by ID
    async getUserById(id: number) {
        const user = await userRepository.findById(id);

        if (!user) {
            return null;
        }

        return this.sanitizeUser(user);
    },

    // Authenticate user with email and password
    async authenticate(email: string, password: string) {
        const user = await userRepository.findByEmail(email);

        if (!user) {
            // Use same error message to prevent email enumeration
            throw new Error("Invalid email or password");
        }

        // Verify password against stored hash
        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }

        // Update last login timestamp
        // await this.userRepository.updateLastLogin(user.id);

        const token = this.generateToken(user);

        return {
            user: this.sanitizeUser(user),
            token,
        };
    },

    generateToken(user: any) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            env.JWT_SECRET,
            { expiresIn: "1h" },
        );
    },

    sanitizeUser(user: any) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
}
