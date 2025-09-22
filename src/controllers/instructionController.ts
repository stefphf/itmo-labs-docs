import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Instruction from "../entities/Instruction";

export const createInstruction = async (req: Request, res: Response) => {
  try {
    const instructionRepository = AppDataSource.getRepository(Instruction);
    const newInstruction = instructionRepository.create(req.body);
    await instructionRepository.save(newInstruction);
    res.status(201).json(newInstruction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInstructions = async (req: Request, res: Response) => {
  try {
    const instructionRepository = AppDataSource.getRepository(Instruction);
    const { recipe_id } = req.query;

    let where: any = {};
    if (recipe_id) where.recipe = { recipe_id: parseInt(recipe_id as string) };

    const instructions = await instructionRepository.find({
      where,
      relations: ["recipe"],
      order: { step_number: "ASC" },
    });
    res.json(instructions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInstructionById = async (req: Request, res: Response) => {
  try {
    const instructionRepository = AppDataSource.getRepository(Instruction);
    const instruction = await instructionRepository.findOne({
      where: { instruction_id: parseInt(req.params.id) },
      relations: ["recipe"],
    });
    instruction
      ? res.json(instruction)
      : res.status(404).json({ message: "Instruction not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInstruction = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const instructionRepository = AppDataSource.getRepository(Instruction);
    const instruction = await instructionRepository.findOneBy({
      instruction_id: parseInt(req.params.id),
    });
    if (!instruction)
      return res.status(404).json({ message: "Instruction not found" });
    instructionRepository.merge(instruction, req.body);
    const result = await instructionRepository.save(instruction);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInstruction = async (req: Request, res: Response) => {
  try {
    const result = await AppDataSource.getRepository(Instruction).delete(
      req.params.id
    );
    result.affected === 1
      ? res.json({ message: "Instruction deleted" })
      : res.status(404).json({ message: "Instruction not found" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
