import api from "./axios";
export const login = (d: any) => api.post("/auth/login", d);
export const register = (d: any) => api.post("/auth/register", d);
