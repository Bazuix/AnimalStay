import { Router } from "express";
import { getStays, createStay, updateStatus,deleteStay,getActiveStays } from "../controllers/stay.controller";

const router = Router();

router.get("/", getStays);
router.get("/active", getActiveStays);
router.post("/", createStay);
router.patch("/:id", updateStatus);
router.delete("/:id", deleteStay);

export default router;