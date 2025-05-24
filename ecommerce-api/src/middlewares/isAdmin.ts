import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== "admin") {
        res.status(403).json({ error: "Access denied: Admin only." });
        return;
    }
    next();
};