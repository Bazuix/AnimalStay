import app from "./app";
import dotenv from "dotenv";
import { seedServices } from "./services/service.service";
import { seedRooms } from "./services/room.service";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`AnimalStay backend running on http://localhost:${PORT}`);
    await seedServices().catch(console.error);
    await seedRooms().catch(console.error);
});