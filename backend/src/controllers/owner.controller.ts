import { Request, Response } from "express";
import * as ownerService from "../services/owner.service";

export const getAllOwners = async (_req: Request, res: Response) => {
    try {
        const owners = await ownerService.getOwners();
        res.json(owners);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania właścicieli" });
    }
};

export const getOwner = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const owner = await ownerService.getOwnerById(id);

        if (!owner) {
            return res.status(404).json({ message: "Nie znaleziono właściciela" });
        }

        res.json(owner);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania właściciela" });
    }
};

export const createOwner = async (req: Request, res: Response) => {
    try {
        const owner = await ownerService.createOwner(req.body);
        res.status(201).json(owner);
    } catch (error) {
        res.status(500).json({ message: "Błąd tworzenia właściciela" });
    }
};

export const deleteOwner = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await ownerService.deleteOwner(id);
        res.json({ message: "Usunięto właściciela" });
    } catch (error) {
        res.status(500).json({ message: "Błąd usuwania właściciela" });
    }
};