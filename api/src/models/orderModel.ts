import { pool } from "../config/db";
import { CartItem } from "./cartModel";

interface OrderSummary {
    id: number;
    user_id: number;
    total: number;
    created_at: Date;
}

interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
}

export const createOrder = async (
    userId: number,
    cartItems: CartItem[]
): Promise<{ order: OrderSummary; items: OrderItem[] }> => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Calculate total price
        let total = 0;
        const orderItems: OrderItem[] = [];

        for (const item of cartItems) {
            const productResult = await client.query(
                "SELECT price FROM products WHERE id = $1",
                [item.product_id]
            );

            const price = parseFloat(productResult.rows[0]?.price || 0);
            total += price * item.quantity;

            orderItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: price
            });
        }

        // Insert into orders table
        const orderResult = await client.query(
            `
            INSERT INTO orders (user_id, total)
            VALUES ($1, $2)
            RETURNING *
            `,
            [userId, total]
        );

        const order = orderResult.rows[0];

        // Insert into order_items
        for (const item of orderItems) {
            await client.query(
                `
                INSERT INTO order_items(order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)
                `,
                [order.id, item.product_id, item.quantity, item.price]
            );
        }

        // Clear the user's cart
        await client.query(
            "DELETE FROM cart_items WHERE user_id = $1",
            [userId]
        );

        await client.query("COMMIT");

        return { order, items: orderItems };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};