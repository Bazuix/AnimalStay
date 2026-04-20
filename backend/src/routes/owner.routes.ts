import { Router } from "express";
import { getAllOwners, createOwner } from "../controllers/owner.controller";

const router = Router();

router.get("/", getAllOwners);
router.post("/", createOwner);

export default router;