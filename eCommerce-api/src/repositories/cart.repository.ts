import { db } from "../prisma/db";

export const cartRepository = {
    // Find product in cart
    async findCartItem({ cartId, productId }: { cartId: number, productId: number }) {
        return await db.orm.public.CartItem.where({
            cartId,
            productId
        }).first()
    },

    async createCartItem(cartId: number, productId: number, quantity: number) {
        return await db.orm.public.CartItem.create({
            cartId,
            productId,
            quantity
        })
    },

    // Create new cart
    async createCart(userId: number) {
        return await db.orm.public.Cart.upsert({
            create: { userId },
            update: {},
            conflictOn: { userId },
        });        
    },

    async updateCartItemQuantity(cartItemId: number, quantity: number) {
        return await db.orm.public.CartItem.where({ id: cartItemId }).update({ quantity });
    }
}
