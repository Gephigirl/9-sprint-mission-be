import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createArticle = async (req, res) => {
  try {
    const { title, content, author, likeCount } = req.body;
    const article = await prisma.article.create({
      data: {
        title,
        content,
        author: author || "익명", 
        likeCount,
      },
    });
    res.status(201).json(article);
  } catch (err) {
    console.error("❌ 게시글 등록 실패:", err);
    res.status(500).json({ message: "게시글 등록 실패", error: err.message });
  }
};


export const getArticle = async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        title: true,
        content: true,
        author: true,
        likeCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!article) return res.status(404).json({ message: "게시글 없음" });
    res.status(200).json(article);
  } catch (err) {
    console.error("❌ 단건 조회 실패:", err);
    res.status(500).json({ message: "조회 실패", error: err.message });
  }
};


export const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort = "recent" } = req.query;
    const skip = (page - 1) * limit;

    const orderBy =
      sort === "like" ? { likeCount: "desc" } : { createdAt: "desc" };

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { author: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: Number(skip),
      take: Number(limit),
      select: {
        id: true,
        title: true,
        content: true,
        author: true,
        likeCount: true,
        createdAt: true,
      },
    });

    res.status(200).json(articles);
  } catch (err) {
    console.error("❌ 목록 조회 실패:", err);
    res.status(500).json({ message: "목록 조회 실패", error: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { title, content, author, likeCount } = req.body;
    const updated = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data: { title, content, author, likeCount },
    });
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ 수정 실패:", err);
    res.status(500).json({ message: "수정 실패", error: err.message });
  }
};


export const deleteArticle = async (req, res) => {
  try {
    await prisma.article.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ message: "게시글 삭제 완료" });
  } catch (err) {
    console.error("❌ 삭제 실패:", err);
    res.status(500).json({ message: "삭제 실패", error: err.message });
  }
};
