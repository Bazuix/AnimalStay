import { Router } from "express";
import { getRooms, createRoom, getRoomsWithStays } from "../controllers/room.controller";

const router = Router();
router.get("/", getRooms);
router.get("/map",  getRoomsWithStays);
router.post("/", createRoom);

export default router;