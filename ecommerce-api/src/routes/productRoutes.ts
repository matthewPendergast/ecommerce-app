import express from "express";
import {
    getProduct,
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct
} from "../controllers/productController";
import { verifyToken } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/", verifyToken, isAdmin, addProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);

export default router;