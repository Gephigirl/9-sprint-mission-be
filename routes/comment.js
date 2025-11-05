import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getComments
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);
router.get("/", getComments);

export default router;
