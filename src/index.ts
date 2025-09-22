import express from "express";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import recipeRoutes from "./routes/recipeRoute";
import commentRoutes from "./routes/commentRoute";
import likeRoutes from "./routes/likeRoute";
import savedRecipeRoutes from "./routes/savedRecipeRoute";
import subscriptionRoutes from "./routes/subscriptionRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/recipes", recipeRoutes);
    app.use("/api/comments", commentRoutes);
    app.use("/api/likes", likeRoutes);
    app.use("/api/saved-recipes", savedRecipeRoutes);
    app.use("/api/subscriptions", subscriptionRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
);

export default app;
