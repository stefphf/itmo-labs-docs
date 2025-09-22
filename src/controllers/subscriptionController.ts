import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Subscription from "../entities/Subscription";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const { followed_id } = req.body;
    const follower_id = (req as any).userId;

    // Проверяем, не подписан ли уже пользователь
    const existingSubscription = await subscriptionRepository.findOne({
      where: {
        follower: { user_id: follower_id },
        followed: { user_id: followed_id },
      },
    });

    if (existingSubscription) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    // Нельзя подписаться на самого себя
    if (follower_id === followed_id) {
      return res.status(400).json({ message: "Cannot subscribe to yourself" });
    }

    const newSubscription = subscriptionRepository.create({
      follower: { user_id: follower_id },
      followed: { user_id: followed_id },
    });

    await subscriptionRepository.save(newSubscription);
    res.status(201).json(newSubscription);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const { follower_id, followed_id } = req.query;

    let where: any = {};
    if (follower_id)
      where.follower = { user_id: parseInt(follower_id as string) };
    if (followed_id)
      where.followed = { user_id: parseInt(followed_id as string) };

    const subscriptions = await subscriptionRepository.find({
      where,
      relations: ["follower", "followed"],
    });
    res.json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({
      where: { subscription_id: parseInt(req.params.id) },
      relations: ["follower", "followed"],
    });
    subscription
      ? res.json(subscription)
      : res.status(404).json({ message: "Subscription not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({
      where: { subscription_id: parseInt(req.params.id) },
      relations: ["follower"],
    });

    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });
    if (subscription.follower.user_id !== (req as any).userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await subscriptionRepository.delete(req.params.id);
    result.affected === 1
      ? res.json({ message: "Subscription deleted" })
      : res.status(404).json({ message: "Subscription not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubscriptionByUser = async (req: Request, res: Response) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const { followed_id } = req.params;
    const follower_id = (req as any).userId;

    const subscription = await subscriptionRepository.findOne({
      where: {
        follower: { user_id: follower_id },
        followed: { user_id: parseInt(followed_id) },
      },
    });

    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    const result = await subscriptionRepository.delete(
      subscription.subscription_id
    );
    result.affected === 1
      ? res.json({ message: "Subscription deleted" })
      : res.status(404).json({ message: "Subscription not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
