import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authService from "../services/auth.service";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

const fakeUser = {
    id: 1,
    email: "worker@animalstay.com",
    password: "$2b$10$hashedpassword",
    role: "worker",
};

// ─────────────────────────────────────────────────────────────
// register()
// ─────────────────────────────────────────────────────────────

describe("authService.register – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("creates a user and returns data without password", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw" as never);
        (mockPrisma.user.create as jest.Mock).mockResolvedValue(fakeUser);

        const result = await authService.register({
            email: "worker@animalstay.com",
            password: "password123",
        });

        expect(result).not.toHaveProperty("password");
        expect(result).toMatchObject({
            id: 1,
            email: "worker@animalstay.com",
            role: "worker",
        });
        expect(mockBcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });

    it("throws when email is already in use", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);

        await expect(
            authService.register({
                email: "worker@animalstay.com",
                password: "pw",
            })
        ).rejects.toThrow("Email already in use");

        expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("defaults role to worker when not provided", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed" as never);
        (mockPrisma.user.create as jest.Mock).mockResolvedValue(fakeUser);

        await authService.register({
            email: "new@test.com",
            password: "pw",
        });

        expect(mockPrisma.user.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ role: "worker" }),
            })
        );
    });
});

describe("authService.register – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: returns password in response", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw" as never);
        (mockPrisma.user.create as jest.Mock).mockResolvedValue(fakeUser);

        const result = await authService.register({
            email: "worker@animalstay.com",
            password: "password123",
        });


        expect(result).toHaveProperty("password");
    });

    it("FAIL: allows registering same email twice", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);


        await authService.register({
            email: "worker@animalstay.com",
            password: "pw",
        });

        expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it("FAIL: hashes password with wrong salt rounds", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw" as never);
        (mockPrisma.user.create as jest.Mock).mockResolvedValue(fakeUser);

        await authService.register({
            email: "test@test.com",
            password: "pw",
        });


        expect(mockBcrypt.hash).toHaveBeenCalledWith("pw", 5);
    });
});

// ─────────────────────────────────────────────────────────────
// login()
// ─────────────────────────────────────────────────────────────

describe("authService.login – positive scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns a JWT token on valid credentials", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);
        (mockBcrypt.compare as jest.Mock).mockResolvedValue(true as never);
        (mockJwt.sign as jest.Mock).mockReturnValue("mock.jwt.token" as never);

        const token = await authService.login({
            email: "worker@animalstay.com",
            password: "password123",
        });

        expect(token).toBe("mock.jwt.token");
        expect(mockJwt.sign).toHaveBeenCalled();
    });

    it("throws when password is wrong", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);
        (mockBcrypt.compare as jest.Mock).mockResolvedValue(false as never);

        await expect(
            authService.login({
                email: "worker@animalstay.com",
                password: "wrongpw",
            })
        ).rejects.toThrow("Invalid credentials");

        expect(mockJwt.sign).not.toHaveBeenCalled();
    });
});

describe("authService.login – negative scenarios", () => {
    beforeEach(() => jest.clearAllMocks());

    it("FAIL: returns token when password is wrong", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);
        (mockBcrypt.compare as jest.Mock).mockResolvedValue(false as never);
        (mockJwt.sign as jest.Mock).mockReturnValue("token" as never);

        const token = await authService.login({
            email: "worker@animalstay.com",
            password: "wrongpw",
        });


        expect(token).toBe("token");
    });

    it("FAIL: signs JWT even when user does not exist", async () => {
        (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
        (mockJwt.sign as jest.Mock).mockReturnValue("token" as never);

        await authService.login({
            email: "ghost@test.com",
            password: "pw",
        });


        expect(mockJwt.sign).toHaveBeenCalled();
    });
});