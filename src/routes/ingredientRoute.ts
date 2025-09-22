import { Router } from "express";
import {
  createIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredientController";
import { authenticate } from "../middleware/auth";

const ingredientRouter = Router();

ingredientRouter.post("/", authenticate, createIngredient);
ingredientRouter.get("/", getIngredients);
ingredientRouter.get("/:id", getIngredientById);
ingredientRouter.put("/:id", authenticate, updateIngredient);
ingredientRouter.delete("/:id", authenticate, deleteIngredient);

export default ingredientRouter;
