import prisma from "../config/prisma";

export const getPets = async () => {
    return prisma.pet.findMany({
        include: { owner: true }
    });
};

export const createPet = async (data: {
    name: string;
    species: string;
    breed?: string;
    age: number;
    ownerId: number;
}) => {
    return prisma.pet.create({ data });
};

export const deletePet = async (id: number) => {
    return prisma.pet.delete({
        where: { id }
    });
};