import { Router } from "express";
import {
  createLike,
  getLikes,
  getLikeById,
  deleteLike,
  deleteLikeByRecipe,
} from "../controllers/likeController";
import { authenticate } from "../middleware/auth";

const likeRouter = Router();

likeRouter.post("/", authenticate, createLike);
likeRouter.get("/", getLikes);
likeRouter.get("/:id", getLikeById);
likeRouter.delete("/:id", authenticate, deleteLike);
likeRouter.delete("/recipe/:recipe_id", authenticate, deleteLikeByRecipe);

export default likeRouter;
