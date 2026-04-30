import * as stayService from "../services/stay.service";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
    stay: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const fakeStay = {
    id: 1,
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-05-07"),
    status: "scheduled",
    notes: "Allergic to chicken",
    needsMeds: false,
    needsWalk: true,
    medsInfo: null,
    petId: 1,
    roomId: 1,
    pet: {
        id: 1,
        name: "Burek",
        species: "Dog",
        breed: "Labrador",
        age: 3,
        owner: {
            id: 1,
            name: "Anna",
            email: "anna@test.com",
            phone: "+48 601 111 222",
        },
    },
    room: {
        id: 1,
        number: 101,
        type: "Standard",
        pricePerDay: 30,
        status: "available",
    },
    services: [],
    payment: null,
};

// ─────────────────────────────────────────────────────────────
// getStays()
// ─────────────────────────────────────────────────────────────

describe("stayService.getStays – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns all stays with relations", async () => {
        (mockPrisma.stay.findMany as jest.Mock).mockResolvedValue([fakeStay]);

        const result = await stayService.getStays();

        expect(result).toHaveLength(1);
        expect(result[0].pet.name).toBe("Burek");
        expect(result[0].room.number).toBe(101);
        expect(mockPrisma.stay.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ orderBy: { startDate: "asc" } })
        );
    });
});

describe("stayService.getStays – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: expects stays WITHOUT room relation", async () => {
        (mockPrisma.stay.findMany as jest.Mock).mockResolvedValue([fakeStay]);

        const result = await stayService.getStays();


        expect(result[0].room).toBeUndefined();
    });

    it("FAIL: expects wrong number of stays", async () => {
        (mockPrisma.stay.findMany as jest.Mock).mockResolvedValue([fakeStay]);

        const result = await stayService.getStays();


        expect(result).toHaveLength(2);
    });
});

// ─────────────────────────────────────────────────────────────
// getActiveStays()
// ─────────────────────────────────────────────────────────────

describe("stayService.getActiveStays – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("filters stays by date range", async () => {
        (mockPrisma.stay.findMany as jest.Mock).mockResolvedValue([fakeStay]);

        const result = await stayService.getActiveStays();

        expect(result).toHaveLength(1);
    });
});

describe("stayService.getActiveStays – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: expects active stays even when Prisma returns empty array", async () => {
        (mockPrisma.stay.findMany as jest.Mock).mockResolvedValue([]);

        const result = await stayService.getActiveStays();


        expect(result).toHaveLength(1);
    });
});

// ─────────────────────────────────────────────────────────────
// createStay()
// ─────────────────────────────────────────────────────────────

describe("stayService.createStay – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    const validInput = {
        petId: 1,
        roomId: 1,
        startDate: "2025-06-01",
        endDate: "2025-06-07",
        needsMeds: false,
        needsWalk: true,
    };

    it("creates stay when room is available", async () => {
        (mockPrisma.stay.findFirst as jest.Mock).mockResolvedValue(null);
        (mockPrisma.stay.create as jest.Mock).mockResolvedValue(fakeStay);

        const result = await stayService.createStay(validInput);

        expect(result.status).toBe("scheduled");
        expect(mockPrisma.stay.create).toHaveBeenCalled();
    });
});

describe("stayService.createStay – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    const validInput = {
        petId: 1,
        roomId: 1,
        startDate: "2025-06-01",
        endDate: "2025-06-07",
    };

    it("FAIL: allows endDate before startDate", async () => {

        await expect(
            stayService.createStay({
                ...validInput,
                startDate: "2025-06-10",
                endDate: "2025-06-01",
            })
        ).resolves.not.toThrow();
    });

    it("FAIL: creates stay even when room is already booked", async () => {
        (mockPrisma.stay.findFirst as jest.Mock).mockResolvedValue(fakeStay);


        await stayService.createStay(validInput);

        expect(mockPrisma.stay.create).toHaveBeenCalled();
    });
});

// ─────────────────────────────────────────────────────────────
// updateStatus()
// ─────────────────────────────────────────────────────────────

describe("stayService.updateStatus – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: expects status NOT to change", async () => {
        const updated = { ...fakeStay, status: "active" };
        (mockPrisma.stay.update as jest.Mock).mockResolvedValue(updated);

        const result = await stayService.updateStatus(1, { status: "active" });


        expect(result.status).toBe("scheduled");
    });
});

// ─────────────────────────────────────────────────────────────
// deleteStay()
// ─────────────────────────────────────────────────────────────

describe("stayService.deleteStay – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("deletes stay by id", async () => {
        (mockPrisma.stay.delete as jest.Mock).mockResolvedValue(fakeStay);

        await stayService.deleteStay(1);

        expect(mockPrisma.stay.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });
});

describe("stayService.deleteStay – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: deletes stay with wrong id", async () => {
        (mockPrisma.stay.delete as jest.Mock).mockResolvedValue(fakeStay);

        await stayService.deleteStay(1);


        expect(mockPrisma.stay.delete).toHaveBeenCalledWith({
            where: { id: 999 },
        });
    });
});