import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Comment from "../entities/Comment";

export const createComment = async (req: Request, res: Response) => {
  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const newComment = commentRepository.create({
      ...req.body,
      user: { user_id: (req as any).userId },
      recipe: { recipe_id: req.body.recipe_id },
    });
    await commentRepository.save(newComment);
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const { recipe_id } = req.query;

    let where: any = {};
    if (recipe_id) where.recipe = { recipe_id: parseInt(recipe_id as string) };

    const comments = await commentRepository.find({
      where,
      relations: ["user", "recipe"],
      order: { created_at: "DESC" },
    });
    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = await commentRepository.findOne({
      where: { comment_id: parseInt(req.params.id) },
      relations: ["user", "recipe"],
    });
    comment
      ? res.json(comment)
      : res.status(404).json({ message: "Comment not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = await commentRepository.findOne({
      where: { comment_id: parseInt(req.params.id) },
      relations: ["user"],
    });

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.user_id !== (req as any).userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    commentRepository.merge(comment, req.body);
    const result = await commentRepository.save(comment);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = await commentRepository.findOne({
      where: { comment_id: parseInt(req.params.id) },
      relations: ["user"],
    });

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.user_id !== (req as any).userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await commentRepository.delete(req.params.id);
    result.affected === 1
      ? res.json({ message: "Comment deleted" })
      : res.status(404).json({ message: "Comment not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
