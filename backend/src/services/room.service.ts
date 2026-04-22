import prisma from "../config/prisma";
export const createRoom = async (data: { number: number; type: string; pricePerDay: number; status?: string }) => {
    return prisma.room.create({ data });
};
export const getRooms = async () => {
    return prisma.room.findMany({ orderBy: { number: "asc" } });
};
