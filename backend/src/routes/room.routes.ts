import { Router } from "express";
import { getRooms, createRoom, getRoomsWithStays } from "../controllers/room.controller";
import {auth} from "../middleware/auth.middleware";
const router = Router();
router.get("/map", auth, getRoomsWithStays);  // specific first
router.get("/", auth, getRooms);
router.post("/",auth, createRoom);

export default router;