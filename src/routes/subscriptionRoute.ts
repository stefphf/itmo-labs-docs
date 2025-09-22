import { Router } from "express";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  deleteSubscription,
  deleteSubscriptionByUser,
} from "../controllers/subscriptionController";
import { authenticate } from "../middleware/auth";

const subscriptionRouter = Router();

subscriptionRouter.post("/", authenticate, createSubscription);
subscriptionRouter.get("/", getSubscriptions);
subscriptionRouter.get("/:id", getSubscriptionById);
subscriptionRouter.delete("/:id", authenticate, deleteSubscription);
subscriptionRouter.delete(
  "/user/:followed_id",
  authenticate,
  deleteSubscriptionByUser
);

export default subscriptionRouter;
