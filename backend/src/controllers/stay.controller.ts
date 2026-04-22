import { Request, Response } from "express";
import * as stayService from "../services/stay.service";

export const getStays = async (_: Request, res: Response) => {
    try{
        const stays = await stayService.getStays();
        res.json(stays);
    }catch(e:any){
        res.status(500).json({ message: e.message });
    }
};
export const getActiveStays = async (_: Request, res: Response) => {
    try{
        const stays = await stayService.getActiveStays();
        res.json(stays);
    }catch(e:any){
        res.status(500).json({ message: e.message });
    }
};

export const createStay = async (req: Request, res: Response) => {
    try {
        const stay = await stayService.createStay(req.body);
        res.status(201).json(stay);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const stay = await stayService.updateStatus(Number(req.params.id), req.body);
        res.json(stay);
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
};
export const deleteStay = async (req: Request, res: Response) => {
    try {
        await stayService.deleteStay(Number(req.params.id));
        res.json({ message: "Stay deleted" });
    } catch (e: any) {
        res.status(400).json({ message: e.message });
    }
};