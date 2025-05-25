import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("E-Commerce API")
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});