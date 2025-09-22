import { Router } from "express";
import {
  createSavedRecipe,
  getSavedRecipes,
  getSavedRecipeById,
  deleteSavedRecipe,
  deleteSavedRecipeByRecipe,
} from "../controllers/savedRecipeController";
import { authenticate } from "../middleware/auth";

const savedRecipeRouter = Router();

savedRecipeRouter.post("/", authenticate, createSavedRecipe);
savedRecipeRouter.get("/", authenticate, getSavedRecipes);
savedRecipeRouter.get("/:id", authenticate, getSavedRecipeById);
savedRecipeRouter.delete("/:id", authenticate, deleteSavedRecipe);
savedRecipeRouter.delete(
  "/recipe/:recipe_id",
  authenticate,
  deleteSavedRecipeByRecipe
);

export default savedRecipeRouter;
