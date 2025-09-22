import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Recipe from "../entities/Recipe";
import { Like, ILike } from "typeorm";

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const newRecipe = recipeRepository.create({
      ...req.body,
      user: { user_id: (req as any).userId },
    });
    await recipeRepository.save(newRecipe);
    res.status(201).json(newRecipe);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const { type, difficulty, search } = req.query;

    let where: any = {};

    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (search) where.title = ILike(`%${search}%`);

    const recipes = await recipeRepository.find({
      where,
      relations: ["user", "ingredients", "instructions", "comments", "likes"],
      order: { created_at: "DESC" },
    });
    res.json(recipes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
      where: { recipe_id: parseInt(req.params.id) },
      relations: [
        "user",
        "ingredients",
        "instructions",
        "comments",
        "comments.user",
        "likes",
      ],
    });
    recipe
      ? res.json(recipe)
      : res.status(404).json({ message: "Recipe not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
      where: { recipe_id: parseInt(req.params.id) },
      relations: ["user"],
    });

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.user.user_id !== (req as any).userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    recipeRepository.merge(recipe, req.body);
    const result = await recipeRepository.save(recipe);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
      where: { recipe_id: parseInt(req.params.id) },
      relations: ["user"],
    });

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.user.user_id !== (req as any).userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await recipeRepository.delete(req.params.id);
    result.affected === 1
      ? res.json({ message: "Recipe deleted" })
      : res.status(404).json({ message: "Recipe not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
