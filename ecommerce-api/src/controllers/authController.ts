import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/userModel";

export const signup = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required."});
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email is already in use."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, hashedPassword);

        return res.status(201).json({
            message: "User created successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            }
        });
    } catch (err) {
        console.error("Signup error: ", err);
        res.status(500).json({ error: "Internal server error."});
    }
};