import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort = "recent" } = req.query;
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ]
      },
      orderBy: sort === "recent" ? { createdAt: "desc" } : { createdAt: "asc" },
      skip,
      take: Number(limit)
    });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};


export const getProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        tags,
        likeCount: 0
      }
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "등록 실패", error: err.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "수정 실패", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({ where: { id } });

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "삭제 실패", error: err.message });
  }
};
