import { Router } from "express";
import {getOwner, getAllOwners, createOwner, deleteOwner } from "../controllers/owner.controller";
import {auth,authorize} from "../middleware/auth.middleware";

const router = Router();

router.get("/:id",auth, getOwner);
router.get("/", auth,getAllOwners);
router.post("/",auth, createOwner);
router.delete("/:id",auth,authorize(["admin"]), deleteOwner);

export default router;