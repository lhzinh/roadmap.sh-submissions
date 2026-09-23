import { productRepository } from "../repositories/product.repository";
import { cartRepository } from "../repositories/cart.repository";

export interface AddToCartDTO {
  userId: number;
  productId: number;
  quantity: number;
}

export const cartService = {
        // Add product to Cart
        async addToCart({ userId, productId, quantity }: AddToCartDTO) {
            const product = await productRepository.findProductById(productId);
            
            if (!product) {
                throw new Error("The product doest not exist.");
            }

            // Create cart in database
            const cart = await cartRepository.createCart(userId);

            const existingCartItem = await cartRepository.findCartItem({
                cartId: cart.id,
                productId
            })

            if (existingCartItem) {
                const newQuantity = existingCartItem.quantity + quantity;
                return await cartRepository.updateCartItemQuantity(existingCartItem.id, newQuantity);
            }
            
            return await cartRepository.createCartItem(cart.id, productId, quantity);
        },
}
