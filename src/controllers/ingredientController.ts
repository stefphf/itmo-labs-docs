import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Ingredient from "../entities/Ingredient";

export const createIngredient = async (req: Request, res: Response) => {
  try {
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const newIngredient = ingredientRepository.create(req.body);
    await ingredientRepository.save(newIngredient);
    res.status(201).json(newIngredient);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getIngredients = async (req: Request, res: Response) => {
  try {
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const { recipe_id } = req.query;

    let where: any = {};
    if (recipe_id) where.recipe = { recipe_id: parseInt(recipe_id as string) };

    const ingredients = await ingredientRepository.find({
      where,
      relations: ["recipe"],
    });
    res.json(ingredients);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const ingredient = await ingredientRepository.findOne({
      where: { ingredient_id: parseInt(req.params.id) },
      relations: ["recipe"],
    });
    ingredient
      ? res.json(ingredient)
      : res.status(404).json({ message: "Ingredient not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIngredient = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const ingredientRepository = AppDataSource.getRepository(Ingredient);
    const ingredient = await ingredientRepository.findOneBy({
      ingredient_id: parseInt(req.params.id),
    });
    if (!ingredient)
      return res.status(404).json({ message: "Ingredient not found" });
    ingredientRepository.merge(ingredient, req.body);
    const result = await ingredientRepository.save(ingredient);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const result = await AppDataSource.getRepository(Ingredient).delete(
      req.params.id
    );
    result.affected === 1
      ? res.json({ message: "Ingredient deleted" })
      : res.status(404).json({ message: "Ingredient not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
