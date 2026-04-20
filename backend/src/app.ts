import express from "express";
import cors from "cors";
import ownerRoutes from "./routes/owner.routes";
import petRoutes from "./routes/pet.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/owners", ownerRoutes);
app.use("/api/pets", petRoutes);

app.use(errorMiddleware);

export default app;