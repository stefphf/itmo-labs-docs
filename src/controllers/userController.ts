import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import User from "../entities/User";

export class UserController {
  static getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { user_id: userId },
      relations: ["recipes", "saved_recipes", "following", "followers"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      profile_photo: user.profile_photo,
      bio: user.bio,
      created_at: user.created_at,
      recipes_count: user.recipes?.length || 0,
      saved_recipes_count: user.saved_recipes?.length || 0,
      following_count: user.following?.length || 0,
      followers_count: user.followers?.length || 0,
    });
  };

  static getAllUsers = async (req: Request, res: Response) => {
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find({
      relations: ["recipes", "saved_recipes"],
    });

    res.json(
      users.map((user) => ({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        profile_photo: user.profile_photo,
        bio: user.bio,
        created_at: user.created_at,
        recipes_count: user.recipes?.length || 0,
        saved_recipes_count: user.saved_recipes?.length || 0,
      }))
    );
  };

  static getUserById = async (req: Request, res: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { user_id: parseInt(req.params.id) },
        relations: ["recipes", "saved_recipes", "following", "followers"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        profile_photo: user.profile_photo,
        bio: user.bio,
        created_at: user.created_at,
        recipes: user.recipes,
        saved_recipes_count: user.saved_recipes?.length || 0,
        following_count: user.following?.length || 0,
        followers_count: user.followers?.length || 0,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const userId = (req as any).userId;

      const user = await userRepository.findOneBy({ user_id: userId });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Разрешаем обновлять только свои данные
      if (user.user_id !== parseInt(req.params.id)) {
        return res.status(403).json({ message: "Access denied" });
      }

      userRepository.merge(user, req.body);
      const result = await userRepository.save(user);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const userId = (req as any).userId;

      const user = await userRepository.findOneBy({
        user_id: parseInt(req.params.id),
      });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Разрешаем удалять только свои данные или админам
      if (user.user_id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const result = await userRepository.delete(req.params.id);
      result.affected === 1
        ? res.json({ message: "User deleted" })
        : res.status(404).json({ message: "User not found" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
