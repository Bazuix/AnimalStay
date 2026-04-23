import prisma from "../config/prisma";

export const getRooms = async () => {
    return prisma.room.findMany({ orderBy: { number: "asc" } });
};

export const getRoomsWithStays = async (startDate?: string, endDate?: string) => {
    const rooms = await prisma.room.findMany({
        orderBy: { number: "asc" },
        include: {
            stays: {
                where: startDate && endDate ? {
                    AND: [
                        { startDate: { lte: new Date(endDate) } },
                        { endDate:   { gte: new Date(startDate) } },
                    ]
                } : {},
                include: {
                    pet: { include: { owner: true } },
                    services: { include: { service: true } },
                }
            }
        }
    });
    return rooms;
};

export const createRoom = async (data: {
    number: number;
    type: string;
    pricePerDay: number;
    status?: string;
}) => {
    return prisma.room.create({
        data: {
            number:     data.number,
            type:       data.type,
            pricePerDay: data.pricePerDay,
            status:     data.status ?? "available",   // ← satisfies required string
        }
    });
};

export const seedRooms = async () => {
    const count = await prisma.room.count();
    if (count === 0) {
        await prisma.room.createMany({
            data: [
                { number: 101, type: "Standard",  pricePerDay: 30,  status: "available" },
                { number: 102, type: "Standard",  pricePerDay: 30,  status: "available" },
                { number: 103, type: "Standard",  pricePerDay: 30,  status: "available" },
                { number: 104, type: "Deluxe",    pricePerDay: 50,  status: "available" },
                { number: 105, type: "Deluxe",    pricePerDay: 50,  status: "available" },
                { number: 106, type: "Suite",     pricePerDay: 80,  status: "available" },
                { number: 107, type: "Suite",     pricePerDay: 80,  status: "available" },
                { number: 108, type: "Kennel",    pricePerDay: 20,  status: "available" },
                { number: 109, type: "Kennel",    pricePerDay: 20,  status: "available" },
                { number: 110, type: "Aquarium",  pricePerDay: 15,  status: "available" },
            ]
        });
    }
};
