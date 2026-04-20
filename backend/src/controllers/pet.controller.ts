import { Request, Response } from "express";
import * as petService from "../services/pet.service";

export const getAllPets = async (_req: Request, res: Response) => {
    try {
        const pets = await petService.getPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania zwierząt" });
    }
};

export const createPet = async (req: Request, res: Response) => {
    try {
        const pet = await petService.createPet(req.body);
        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ message: "Błąd tworzenia zwierzęcia" });
    }
};

export const deletePet = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await petService.deletePet(id);
        res.json({ message: "Usunięto zwierzę" });
    } catch (error) {
        res.status(500).json({ message: "Błąd usuwania zwierzęcia" });
    }
};