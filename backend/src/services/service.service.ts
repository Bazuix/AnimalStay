import prisma from "../config/prisma";

export const getServices = async () => {
    return prisma.service.findMany();
};

export const seedServices = async () => {
    const count = await prisma.service.count();
    if (count === 0) {
        await prisma.service.createMany({
            data: [
                { name: "Medication administration", price: 15 },
                { name: "Daily walk", price: 10 },
                { name: "Grooming", price: 30 },
                { name: "Veterinary check", price: 50 },
                { name: "Special diet", price: 20 },
            ]
        });
    }
};