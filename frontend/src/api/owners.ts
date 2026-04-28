import api from "./axios";
export const getOwners = () => api.get("/owners");
export const createOwner = (d: any) => api.post("/owners", d);
export const deleteOwner = (id: number) => api.delete(`/owners/${id}`);
