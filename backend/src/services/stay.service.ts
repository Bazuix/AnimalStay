import prisma from "../config/prisma";

export const getStays = async () => {
    return prisma.stay.findMany({
        include: {
            pet: { include: { owner: true } },
            room: true,
            services: { include: { service: true } },
            payment: true
        },
        orderBy: { startDate: "asc" }
    });
};
export const getActiveStays = async () => {
    const now = new Date();
    return prisma.stay.findMany({
        where: {
            startDate: { lte: now },
            endDate: { gte: now }
        },
        include: {
            pet: { include: { owner: true } },
            room: true,
            services: { include: { service: true } }
        }
    });
};

export const createStay = async (data: {
    petId: number;
    roomId: number;
    startDate: string;
    endDate: string;
    status?: string;
    serviceIds?: number[];
    notes?: string;
    needsMeds?: boolean;
    needsWalk?: boolean;
    medsInfo?: string;
}) => {
    const { serviceIds, ...stayData } = data;

    if (new Date(stayData.endDate) < new Date(stayData.startDate)) {
        throw new Error("End date cannot be before start date");
    }

    const existing = await prisma.stay.findFirst({
        where: {
            roomId: stayData.roomId,
            AND: [
                { startDate: { lte: new Date(stayData.endDate) } },
                { endDate: { gte: new Date(stayData.startDate) } }
            ]
        }
    });

    if (existing) throw new Error("Room is not available for those dates");

    const stay = await prisma.stay.create({
        data: {
            petId: stayData.petId,
            roomId: stayData.roomId,
            startDate: new Date(stayData.startDate),
            endDate: new Date(stayData.endDate),
            status: stayData.status || "scheduled",
            notes: stayData.notes,
            needsMeds: stayData.needsMeds || false,
            needsWalk: stayData.needsWalk !== false,
            medsInfo: stayData.medsInfo,
            ...(serviceIds && serviceIds.length > 0 ? {
                services: {
                    create: serviceIds.map((sid: number) => ({ serviceId: sid }))
                }
            } : {})
        },
        include: {
            pet: { include: { owner: true } },
            room: true,
            services: { include: { service: true } }
        }
    });

    return stay;
};

export const updateStatus = async (id: number, data: {
    status?: string;
    needsMeds?: boolean;
    needsWalk?: boolean;
    medsInfo?: string;
    notes?: string;
}) => {
    return prisma.stay.update({
        where: { id },
        data,
        include: {
            pet: { include: { owner: true } },
            room: true,
            services: { include: { service: true } }
        }
    });
};

export const deleteStay = async (id: number) => {
    return prisma.stay.delete({ where: { id } });
};
