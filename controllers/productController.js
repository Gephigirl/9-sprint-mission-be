import Product from "../models/Product.js";

// 상품 목록 조회
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort = "recent" } = req.query;
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    };

    let products = Product.find(query);

    if (sort === "recent") products = products.sort({ createdAt: -1 });

    const skip = (page - 1) * limit;
    products = await products.skip(skip).limit(Number(limit));

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};

// 상품 상세 조회
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};

// 상품 등록
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const newProduct = await Product.create({ name, description, price, tags });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "등록 실패", error: err.message });
  }
};

// 상품 수정
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "수정 실패", error: err.message });
  }
};

// 상품 삭제
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "삭제 실패", error: err.message });
  }
};
