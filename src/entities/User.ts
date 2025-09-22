import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Recipe from "./Recipe";
import Comment from "./Comment";
import Like from "./Like";
import SavedRecipe from "./SavedRecipe";
import Subscription from "./Subscription";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profile_photo: string;

  @Column("text", { nullable: true })
  bio: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => SavedRecipe, (savedRecipe) => savedRecipe.user)
  saved_recipes: SavedRecipe[];

  @OneToMany(() => Subscription, (subscription) => subscription.follower)
  following: Subscription[];

  @OneToMany(() => Subscription, (subscription) => subscription.followed)
  followers: Subscription[];
}
