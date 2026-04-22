import api from "./axios";
export const getRooms = () => api.get("/rooms");
