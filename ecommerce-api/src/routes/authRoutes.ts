import express from "express";
import { AuthRequest, verifyToken } from "../middlewares/authMiddleware";
import { signup, login } from "../controllers/authController";

const router = express.Router();

router.get("/profile", verifyToken, (req: AuthRequest, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
});
router.post("/signup", signup);
router.post("/login", login);

export default router