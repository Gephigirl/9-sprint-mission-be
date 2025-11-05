import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.js";
import articleRoutes from "./routes/article.js";
import commentRoutes from "./routes/comment.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 4000;
const startServer = async () => {
  try {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to DB:", err.message);
  }
};

startServer();