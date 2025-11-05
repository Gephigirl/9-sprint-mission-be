import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createComment = async (req, res) => {
  try {
    const { articleId, content, parentId } = req.body;
    const comment = await prisma.comment.create({
      data: {
        articleId: Number(articleId),
        content,
        ...(parentId && { parentId: Number(parentId) })
      }
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "댓글 등록 실패", error: err.message });
  }
};



export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await prisma.comment.update({
      where: { id: Number(req.params.id) },
      data: { content },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "댓글 수정 실패", error: err.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    await prisma.comment.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ message: "댓글 삭제 완료" });
  } catch (err) {
    res.status(500).json({ message: "댓글 삭제 실패", error: err.message });
  }
};


export const getComments = async (req, res) => {
  try {
    const { articleId, limit = 10 } = req.query;

 
    const comments = await prisma.comment.findMany({
      where: { articleId: Number(articleId), parentId: null },
      include: { children: true }, 
      orderBy: { id: "asc" },
      take: Number(limit),
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "댓글 조회 실패", error: err.message });
  }
};
