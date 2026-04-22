import { Router } from "express";
import { getRooms, createRoom } from "../controllers/room.controller";

const router = Router();
router.get("/", getRooms);
router.post("/", createRoom);

export default router;