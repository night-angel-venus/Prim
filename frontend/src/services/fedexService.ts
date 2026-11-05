import api from "../api";
import type { Fedex } from "../types";

export const getFedex = async (companions?: string, reason?: string) => {
    let url = '/fedex/history?';
    if (companions) url += `companions=${companions}&`;
    if (reason) url += `reason=${reason}`;
    
    const response = await api.get<Fedex[]>(url);
    return response.data;
};

export const createFedex = async (data: any) => {
    return await api.post('/fedex/history', data);
};

export const updateFedex = async (id: number, data: any) => {
    return await api.put(`/fedex/history/${id}`, data);
};
