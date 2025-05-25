import express from "express";
import {
    getCart,
    clearCart,
    addCartItem,
    deleteCartItem,
    updateCartItem
} from "../controllers/cartController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(verifyToken);

router.get("/", getCart);
router.delete("/clear", clearCart);

router.post("/add", addCartItem);
router.delete("/remove/:productId", deleteCartItem);
router.put("/update/:productId", updateCartItem);

export default router;