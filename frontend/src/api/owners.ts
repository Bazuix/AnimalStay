import api from "./axios";

export const getOwners = async () => {
    const res = await api.get("/owners");
    return res.data;
};

export const createOwner = async (data: {
    name: string;
    email: string;
    phone: string;
}) => {
    const res = await api.post("/owners", data);
    return res.data;
};

export const deleteOwner = async (id: number) => {
    const res = await api.delete(`/owners/${id}`);
    return res.data;
};