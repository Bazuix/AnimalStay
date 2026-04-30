import * as petService from "../services/pet.service";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
    pet: {
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const fakePet = {
    id: 1,
    name: "Burek",
    species: "Dog",
    breed: "Labrador",
    age: 3,
    ownerId: 1,
    owner: {
        id: 1,
        name: "Anna Kowalska",
        email: "anna@test.com",
        phone: "+48 601 111 222",
    },
};

// ─────────────────────────────────────────────────────────────
// getPets()
// ─────────────────────────────────────────────────────────────

describe("petService.getPets – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns list of pets with owner included", async () => {
        (mockPrisma.pet.findMany as jest.Mock).mockResolvedValue([fakePet]);

        const result = await petService.getPets();

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ name: "Burek", species: "Dog" });
        expect(result[0].owner).toBeDefined();
        expect(mockPrisma.pet.findMany).toHaveBeenCalledWith({
            include: { owner: true },
        });
    });

    it("returns empty array when no pets exist", async () => {
        (mockPrisma.pet.findMany as jest.Mock).mockResolvedValue([]);

        const result = await petService.getPets();

        expect(result).toEqual([]);
    });
});

describe("petService.getPets – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: expects pet WITHOUT owner", async () => {
        (mockPrisma.pet.findMany as jest.Mock).mockResolvedValue([fakePet]);

        const result = await petService.getPets();


        expect(result[0].owner).toBeUndefined();
    });

    it("FAIL: expects wrong number of pets", async () => {
        (mockPrisma.pet.findMany as jest.Mock).mockResolvedValue([fakePet]);

        const result = await petService.getPets();


        expect(result).toHaveLength(2);
    });
});

// ─────────────────────────────────────────────────────────────
// createPet()
// ─────────────────────────────────────────────────────────────

describe("petService.createPet – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("creates a pet with all fields", async () => {
        (mockPrisma.pet.create as jest.Mock).mockResolvedValue(fakePet);

        const input = {
            name: "Burek",
            species: "Dog",
            breed: "Labrador",
            age: 3,
            ownerId: 1,
        };

        const result = await petService.createPet(input);

        expect(result).toMatchObject({ name: "Burek", species: "Dog" });
        expect(mockPrisma.pet.create).toHaveBeenCalledWith({ data: input });
    });

    it("propagates Prisma errors", async () => {
        (mockPrisma.pet.create as jest.Mock).mockRejectedValue(
            new Error("Foreign key constraint failed")
        );

        await expect(
            petService.createPet({
                name: "X",
                species: "Dog",
                age: 1,
                ownerId: 9999,
            })
        ).rejects.toThrow("Foreign key constraint failed");
    });
});

describe("petService.createPet – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: expects create to be called with include owner", async () => {
        (mockPrisma.pet.create as jest.Mock).mockResolvedValue(fakePet);

        await petService.createPet({
            name: "Burek",
            species: "Dog",
            age: 3,
            ownerId: 1,
        });


        expect(mockPrisma.pet.create).toHaveBeenCalledWith({
            data: {
                name: "Burek",
                species: "Dog",
                age: 3,
                ownerId: 1,
            },
            include: { owner: true },
        });
    });

    it("FAIL: expects createPet not to throw", async () => {
        (mockPrisma.pet.create as jest.Mock).mockRejectedValue(
            new Error("Foreign key constraint failed")
        );


        await expect(
            petService.createPet({
                name: "X",
                species: "Dog",
                age: 1,
                ownerId: 9999,
            })
        ).resolves.not.toThrow();
    });
});

// ─────────────────────────────────────────────────────────────
// deletePet()
// ─────────────────────────────────────────────────────────────

describe("petService.deletePet – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("deletes a pet by id", async () => {
        (mockPrisma.pet.delete as jest.Mock).mockResolvedValue(fakePet);

        await petService.deletePet(1);

        expect(mockPrisma.pet.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });
});

describe("petService.deletePet – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: deletes pet with wrong id", async () => {
        (mockPrisma.pet.delete as jest.Mock).mockResolvedValue(fakePet);

        await petService.deletePet(1);


        expect(mockPrisma.pet.delete).toHaveBeenCalledWith({
            where: { id: 999 },
        });
    });

    it("throws when pet does not exist", async () => {
        (mockPrisma.pet.delete as jest.Mock).mockRejectedValue(
            new Error("Record to delete does not exist")
        );

        await expect(
            petService.deletePet(9999)
        ).rejects.toThrow("Record to delete does not exist");
    });
});