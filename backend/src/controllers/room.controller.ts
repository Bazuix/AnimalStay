import { Request, Response } from "express";
import * as roomService from "../services/room.service";

export const getRooms = async (_: Request, res: Response) => {
    try{
        const rooms = await roomService.getRooms();
        res.json(rooms);
    }catch(e:any){
        res.status(500).json({ message: e.message });
    }
};
export const createRoom = async (req: Request, res: Response) => {
    try{
        const room = await  roomService.createRoom(req.body);
        res.status(201).json(room);
    }catch(e:any){
        res.status(400).json({ message: e.message });
    }
};