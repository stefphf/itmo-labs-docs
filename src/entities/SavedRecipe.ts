import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from "./User";
import Recipe from "./Recipe";

@Entity()
export default class SavedRecipe {
  @PrimaryGeneratedColumn()
  saved_recipe_id: number;

  @ManyToOne(() => User, (user) => user.saved_recipes)
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.saved_by)
  recipe: Recipe;
}
