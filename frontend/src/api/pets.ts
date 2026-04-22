import api from "./axios";
export const getPets = () => api.get("/pets");
export const createPet = (d: any) => api.post("/pets", d);
export const deletePet = (id: number) => api.delete(`/pets/${id}`);
