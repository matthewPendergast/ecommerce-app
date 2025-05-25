import { pool } from "../config/db";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at?: Date;
};

export const createUser = async (name: string, email: string, hashedPassword: string, role: string = "user"): Promise<User> => {
    const result = await pool.query(
        `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, password, role, created_at
        `,
        [name, email, hashedPassword, role]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0] || null;
};