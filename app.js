import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 4000;
const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to DB:", err.message);
  }
};

startServer();