import { db } from "../prisma/db";

export const productRepository = {
    async findProductById(id: number) {
        return await db.orm.public.Product.first({ id })
    }
}
