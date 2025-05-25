import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
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
        return res.status(500).json({ error: "Internal server error."});
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required."});
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "User not found."});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const payload = { userId: user.id, email: user.email, role: user.role };

        const signOptions: SignOptions = {
            expiresIn: jwtExpiresIn as jwt.SignOptions["expiresIn"]
        };

        const token = jwt.sign(
            payload,
            jwtSecret as jwt.Secret,
            signOptions
        );

        return res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error: ", err);
        return res.status(500).json({ error: "Internal server error."});
    }
};