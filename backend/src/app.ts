import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import ownerRoutes from "./routes/owner.routes";
import petRoutes from "./routes/pet.routes";
import stayRoutes from "./routes/stay.routes";
import roomRoutes from "./routes/room.routes";
import authRoutes from "./routes/auth.routes";
import serviceRoutes from "./routes/service.routes"
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/owners", ownerRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/stays", stayRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);


app.use(errorMiddleware);

export default app;