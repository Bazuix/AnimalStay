import api from "./axios";

export const login = (data: { email: string; password: string; }) => {
    return api.post("/auth/login", data);
};
export const register = (d: any) => api.post("/auth/register", d);
