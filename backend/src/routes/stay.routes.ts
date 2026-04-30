import { Router } from "express";
import { getStays, createStay, updateStatus,deleteStay,getActiveStays } from "../controllers/stay.controller";
import {auth,authorize} from "../middleware/auth.middleware";
const router = Router();

router.get("/", auth, getStays);
router.get("/active", auth, getActiveStays);  // must be before /:id
router.post("/", auth, createStay);
router.patch("/:id", auth, updateStatus);
router.delete("/:id", auth, authorize(["admin"]), deleteStay);

export default router;