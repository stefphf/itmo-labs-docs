import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import SavedRecipe from "../entities/SavedRecipe";

export const createSavedRecipe = async (req: Request, res: Response) => {
  try {
    const savedRecipeRepository = AppDataSource.getRepository(SavedRecipe);
    const { recipe_id } = req.body;

    // Проверяем, не сохранен ли уже рецепт
    const existingSavedRecipe = await savedRecipeRepository.findOne({
      where: {
        user: { user_id: (req as any).userId },
        recipe: { recipe_id: recipe_id },
      },
    });

    if (existingSavedRecipe) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    const newSavedRecipe = savedRecipeRepository.create({
      user: { user_id: (req as any).userId },
      recipe: { recipe_id: recipe_id },
    });

    await savedRecipeRepository.save(newSavedRecipe);
    res.status(201).json(newSavedRecipe);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedRecipes = async (req: Request, res: Response) => {
  try {
    const savedRecipeRepository = AppDataSource.getRepository(SavedRecipe);
    const user_id = (req as any).userId;

    const savedRecipes = await savedRecipeRepository.find({
      where: { user: { user_id: user_id } },
      relations: ["recipe", "recipe.user", "recipe.ingredients"],
    });

    res.json(savedRecipes.map((sr) => sr.recipe));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedRecipeById = async (req: Request, res: Response) => {
  try {
    const savedRecipeRepository = AppDataSource.getRepository(SavedRecipe);
    const savedRecipe = await savedRecipeRepository.findOne({
      where: { saved_recipe_id: parseInt(req.params.id) },
      relations: ["user", "recipe"],
    });
    savedRecipe
      ? res.json(savedRecipe)
      : res.status(404).json({ message: "Saved recipe not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavedRecipe = async (req: Request, res: Response) => {
  try {
    const savedRecipeRepository = AppDataSource.getRepository(SavedRecipe);
    const savedRecipe = await savedRecipeRepository.findOne({
      where: { saved_recipe_id: parseInt(req.params.id) },
      relations: ["user"],
    });

    if (!savedRecipe)
      return res.status(404).json({ message: "Saved recipe not found" });
    if (savedRecipe.user.user_id !== (req as any).userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await savedRecipeRepository.delete(req.params.id);
    result.affected === 1
      ? res.json({ message: "Saved recipe deleted" })
      : res.status(404).json({ message: "Saved recipe not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSavedRecipeByRecipe = async (
  req: Request,
  res: Response
) => {
  try {
    const savedRecipeRepository = AppDataSource.getRepository(SavedRecipe);
    const { recipe_id } = req.params;

    const savedRecipe = await savedRecipeRepository.findOne({
      where: {
        user: { user_id: (req as any).userId },
        recipe: { recipe_id: parseInt(recipe_id) },
      },
    });

    if (!savedRecipe)
      return res.status(404).json({ message: "Saved recipe not found" });

    const result = await savedRecipeRepository.delete(
      savedRecipe.saved_recipe_id
    );
    result.affected === 1
      ? res.json({ message: "Saved recipe deleted" })
      : res.status(404).json({ message: "Saved recipe not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
