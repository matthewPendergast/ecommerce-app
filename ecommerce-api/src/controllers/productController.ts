import { Request, Response } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProductById,
    updateProductById
} from "../models/productModel";

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    try {
        const product = await getProductById(id);
        if (!product) {
            res.status(400).json({ error: "Product not found." });
            return;
        }
        res.status(200).json(product);
    } catch (err) {
        console.error("Error fetching product: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error("Error fetching products: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
        res.status(400).json({ error: "Name, price, and stock are required." });
        return;
    }

    try {
        const product = await createProduct(name, description, price, stock);
        res.status(201).json(product);
    } catch (err) {
        console.error("Error creating product: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    try {
        const success = await deleteProductById(id);
        if (!success) {
            res.status(404).json({ error: "Product not found." });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (err) {
        console.error("Error deleting product: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const { name, description, price, stock } = req.body;

    if (!name || price === undefined || stock === undefined) {
        res.status(400).json({ error: "Name, price, and stock are required." });
        return;
    }

    try {
        const updatedProduct = await updateProductById(id, name, description, price, stock);
        if (!updatedProduct) {
            res.status(404).json({ error: "Product not found." });
            return;
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Error updating product: ", err);
        res.status(500).json({ error: "Internal server error." });
    }
};