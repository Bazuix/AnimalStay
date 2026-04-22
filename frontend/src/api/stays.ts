import api from "./axios";
export const createStay = (d: any) => api.post("/stays", d);
export const getStays = () => api.get("/stays");
export const getActiveStays = () => api.get("/stays/active");
export const updateStay = (id: number, d: any) => api.patch(`/stays/${id}`, d);
export const deleteStay = (id: number) => api.delete(`/stays/${id}`);
