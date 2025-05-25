import express from "express";
import { AuthRequest, verifyToken } from "../middlewares/authMiddleware";
import { validateSignup, validateLogin, handleValidationErrors } from "../middlewares/validationMiddleware";
import { signup, login } from "../controllers/authController";

const router = express.Router();

router.get("/profile", verifyToken, (req: AuthRequest, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
});
router.post("/signup", validateSignup, handleValidationErrors, signup);
router.post("/login", validateLogin, handleValidationErrors, login);

export default router