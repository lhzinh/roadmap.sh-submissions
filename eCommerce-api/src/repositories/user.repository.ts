import { db } from "../prisma/db";

export const userRepository = {
    // Find user by email
    async findByEmail(email: string) {
        return await db.orm.public.User.where({
            email: email,
        }).first();
    },

    // Find user by ID
    async findById(userId: number) {
        return await db.orm.public.User.first({ id: userId });
    },

    // Update last login timestamp
    async updateLastLogin(id: number) {
        // return pool.query(
        //     "UPDATE users SET last_login_at = NOW() WHERE id = $1",
        //     [id],
        // );
    },

    // Create new user
    async create({
        name,
        email,
        username,
        password,
    }: {
        name: string;
        email: string;
        username: string;
        password: string;
    }) {
        return await db.orm.public.User.upsert({
            create: {
                name,
                email: email.toLowerCase(),
                username,
                password,
            },
            update: {},
            conflictOn: { email },
        });
    }
}
