import { Router } from "express";
import {
    getAllPets,
    createPet,
    deletePet
} from "../controllers/pet.controller";

const router = Router();

router.get("/", getAllPets);
router.post("/", createPet);
router.delete("/:id", deletePet);

export default router;