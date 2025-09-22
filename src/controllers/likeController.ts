import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Like from "../entities/Like";

export const createLike = async (req: Request, res: Response) => {
  try {
    const likeRepository = AppDataSource.getRepository(Like);
    const { recipe_id } = req.body;

    // Проверяем, не поставлен ли уже лайк
    const existingLike = await likeRepository.findOne({
      where: {
        user: { user_id: (req as any).userId },
        recipe: { recipe_id: recipe_id },
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: "Like already exists" });
    }

    const newLike = likeRepository.create({
      user: { user_id: (req as any).userId },
      recipe: { recipe_id: recipe_id },
    });

    await likeRepository.save(newLike);
    res.status(201).json(newLike);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLikes = async (req: Request, res: Response) => {
  try {
    const likeRepository = AppDataSource.getRepository(Like);
    const { recipe_id, user_id } = req.query;

    let where: any = {};
    if (recipe_id) where.recipe = { recipe_id: parseInt(recipe_id as string) };
    if (user_id) where.user = { user_id: parseInt(user_id as string) };

    const likes = await likeRepository.find({
      where,
      relations: ["user", "recipe"],
    });
    res.json(likes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLikeById = async (req: Request, res: Response) => {
  try {
    const likeRepository = AppDataSource.getRepository(Like);
    const like = await likeRepository.findOne({
      where: { like_id: parseInt(req.params.id) },
      relations: ["user", "recipe"],
    });
    like ? res.json(like) : res.status(404).json({ message: "Like not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLike = async (req: Request, res: Response) => {
  try {
    const likeRepository = AppDataSource.getRepository(Like);
    const like = await likeRepository.findOne({
      where: { like_id: parseInt(req.params.id) },
      relations: ["user"],
    });

    if (!like) return res.status(404).json({ message: "Like not found" });
    if (like.user.user_id !== (req as any).userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await likeRepository.delete(req.params.id);
    result.affected === 1
      ? res.json({ message: "Like deleted" })
      : res.status(404).json({ message: "Like not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLikeByRecipe = async (req: Request, res: Response) => {
  try {
    const likeRepository = AppDataSource.getRepository(Like);
    const { recipe_id } = req.params;

    const like = await likeRepository.findOne({
      where: {
        user: { user_id: (req as any).userId },
        recipe: { recipe_id: parseInt(recipe_id) },
      },
    });

    if (!like) return res.status(404).json({ message: "Like not found" });

    const result = await likeRepository.delete(like.like_id);
    result.affected === 1
      ? res.json({ message: "Like deleted" })
      : res.status(404).json({ message: "Like not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
