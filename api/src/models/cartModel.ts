import { pool } from "../config/db";

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    created_at: Date;
    product_name: string;
    product_price: string | number;
    product_stock: number;
}

export const getCartByUserId = async (userId: number): Promise<CartItem[]> => {
    const result = await pool.query(
        `
        SELECT
		    ci.id,
			ci.user_id,
			ci.product_id,
			ci.quantity,
			ci.created_at,
			p.name AS product_name,
			p.price AS product_price,
			p.stock AS product_stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = $1
        ORDER BY ci.created_at DESC
        `,
        [userId]
    );
    return result.rows;
};

export const clearCartByUserId = async (userId: number): Promise<void> => {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
};

export const addToCart = async (
    userId: number,
    productId: number,
    quantity: number
): Promise<CartItem> => {
    const result = await pool.query(
        `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
        RETURNING *
        `,
        [userId, productId, quantity]
    );
    return result.rows[0];
};

export const removeFromCart = async (
    userId: number,
    productId: number
): Promise<boolean> => {
    const result = await pool.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        [userId, productId]
    );
    return (result.rowCount ?? 0) > 0;
};

export const updateCartItemQuantity = async (
    userId: number,
    productId: number,
    quantity: number
): Promise<CartItem | null> => {
    const result = await pool.query(
        `
        UPDATE cart_items
        SET quantity = $1
        WHERE user_id = $2 AND product_id = $3
        RETURNING *
        `,
        [quantity, userId, productId]
    );
    return result.rows[0] || null;
};