import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import User from "./User";
import Ingredient from "./Ingredient";
import Instruction from "./Instruction";
import Comment from "./Comment";
import Like from "./Like";
import SavedRecipe from "./SavedRecipe";

@Entity()
export default class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  difficulty: string;

  @Column()
  type: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ nullable: true })
  video_url: string;

  @Column({ nullable: true })
  image_url: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe)
  ingredients: Ingredient[];

  @OneToMany(() => Instruction, (instruction) => instruction.recipe)
  instructions: Instruction[];

  @OneToMany(() => Comment, (comment) => comment.recipe)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.recipe)
  likes: Like[];

  @OneToMany(() => SavedRecipe, (savedRecipe) => savedRecipe.recipe)
  saved_by: SavedRecipe[];
}
