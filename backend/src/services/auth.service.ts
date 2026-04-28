import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "animalstay_super_secret_key_2024";

export const register = async (data: { email: string; password: string; role?: string }) => {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Email already in use");

    const hash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: { email: data.email, password: hash, role: data.role || "worker" }
    });
    const { password: _, ...safe } = user;
    return safe;
};

export const login = async (data: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });

    console.log("LOGIN ATTEMPT:", data.email);
    console.log("USER FROM DB:", user);

    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(data.password, user.password);

    console.log("PASSWORD VALID:", valid);

    if (!valid) throw new Error("Wrong password");

    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { token };
};