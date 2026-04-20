import prisma from "../config/prisma";

export const getOwners = async () => {
    return prisma.owner.findMany({
        include: { pets: true }
    });
};

export const getOwnerById = async (id: number) => {
    return prisma.owner.findUnique({
        where: { id },
        include: { pets: true }
    });
};

export const createOwner = async (data: {
    name: string;
    email: string;
    phone: string;
}) => {
    return prisma.owner.create({ data });
};

export const deleteOwner = async (id: number) => {
    return prisma.owner.delete({
        where: { id }
    });
};