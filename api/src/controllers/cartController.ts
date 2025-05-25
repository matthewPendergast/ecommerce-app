import { Request, Response } from "express";
import {
    getCartByUserId,
    clearCartByUserId,
    addToCart,
    removeFromCart,
    updateCartItemQuantity
} from "../models/cartModel";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const items = await getCartByUserId(req.user.userId);
        res.status(200).json(items);
    } catch (err) {
        console.error("Error fetching cart: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await clearCartByUserId(req.user.userId);
        res.status(200).json({ message: "Cart cleared." });
    } catch (err) {
        console.error("Error clearing cart: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const addCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
        res.status(400).json({ error: "Product ID and positive quantity are required." });
        return;
    }

    try {
        const item = await addToCart(req.user.userId, product_id, quantity);
        res.status(201).json(item);
    } catch (err) {
        console.error("Error adding to cart: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const productId = parseInt(req.params.productId, 10);

    try {
        const success = await removeFromCart(req.user.userId, productId);
        if (!success) {
            res.status(404).json({ error: "Item not found in cart." });
            return;
        }
        res.status(200).json({ message: "Item removed from cart." });
    } catch (err) {
        console.error("Error removing from cart: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const productId = parseInt(req.params.productId, 10);
    const { quantity }= req.body;

    if (!quantity || quantity <= 0) {
        res.status(400).json({ error: "Quantity must be a positive number." });
        return;
    }

    try {
        const updatedItem = await updateCartItemQuantity(req.user.userId, productId, quantity);
        if (!updatedItem) {
            res.status(404).json({ error: "Cart item not found." });
            return;
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        console.error("Error updating cart item: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};