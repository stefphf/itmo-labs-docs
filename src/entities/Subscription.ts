import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import User from "./User";

@Entity()
export default class Subscription {
  @PrimaryGeneratedColumn()
  subscription_id: number;

  @ManyToOne(() => User, (user) => user.following)
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  followed: User;
}
