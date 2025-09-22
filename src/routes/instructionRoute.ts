import { Router } from "express";
import {
  createInstruction,
  getInstructions,
  getInstructionById,
  updateInstruction,
  deleteInstruction,
} from "../controllers/instructionController";
import { authenticate } from "../middleware/auth";

const instructionRouter = Router();

instructionRouter.post("/", authenticate, createInstruction);
instructionRouter.get("/", getInstructions);
instructionRouter.get("/:id", getInstructionById);
instructionRouter.put("/:id", authenticate, updateInstruction);
instructionRouter.delete("/:id", authenticate, deleteInstruction);

export default instructionRouter;
