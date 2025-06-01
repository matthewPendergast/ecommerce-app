import { pool } from "../config/db";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    created_at: Date;
}

export const getAllProducts = async (): Promise<Product[]> => {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    return result.rows;
};

export const getProductById = async (id: number): Promise<Product | null> => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0] || null;
};

export const createProduct = async (
    name: string,
    description: string,
    price: number,
    stock: number
): Promise<Product> => {
    const result = await pool.query(
        `
        INSERT INTO products (name, description, price, stock)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [name, description, price, stock]
    );
    return result.rows[0];
};

export const deleteProductById = async (id: number): Promise<boolean> => {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
};

export const updateProductById = async (
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number
): Promise<Product | null> => {
    const result = await pool.query(
        `
        UPDATE products
        SET name = $1,
            description = $2,
            price = $3,
            stock = $4
        WHERE id = $5
        RETURNING *
        `,
        [name, description, price, stock, id]
    );
    return result.rows[0] || null;
};