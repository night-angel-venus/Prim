import api from "../api";
import type { Tiktok } from "../types";

export const getTiktok = async (hosts?: string, noLiveDay?: boolean) => {
    let url = '/tiktok/history?';
    
    if (hosts) {
        url += `hosts=${hosts}&`;
    }
    
    // If noLiveDay is explicitly set to true or false, add it to the URL
    if (noLiveDay !== undefined) {
        url += `no_live_day=${noLiveDay}`;
    }
    
    const response = await api.get<Tiktok[]>(url);
    return response.data;
};

export const createTiktok = async (data: any) => {
    return await api.post('/tiktok/history', data);
};

export const updateTiktok = async (id: number, data: any) => {
    return await api.put(`/tiktok/history/${id}`, data);
};