import { Request, Response } from "express";
import * as serviceService from "../services/service.service";

export const getServices = async (_: Request, res: Response) => {
    try {
        const services = await serviceService.getServices();
        res.json(services);
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
};
