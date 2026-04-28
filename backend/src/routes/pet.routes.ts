import { Router } from "express";
import { auth,authorize} from "../middleware/auth.middleware";
import {getAllPets, createPet, deletePet
} from "../controllers/pet.controller";

const router = Router();

router.get("/",auth, getAllPets);
router.post("/",auth, createPet);
router.delete("/:id",auth,authorize(["admin"]), deletePet);

export default router;