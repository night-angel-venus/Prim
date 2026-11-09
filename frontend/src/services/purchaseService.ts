import api from "../api";
import type { Purchase } from "../types";

export const getPurchases = async (item?: string, beneficiary?: string, source?: string) => {
    const params = new URLSearchParams();
    
    if (item) params.append('item', item);
    if (beneficiary) params.append('beneficiary', beneficiary);
    if (source) params.append('source', source);
    
    const url = `/purchases/history?${params.toString()}`;
    const response = await api.get<Purchase[]>(url);
    return response.data;
};

export const createPurchase = async (data: any) => {
    return await api.post('/purchases/history', data);
};

export const updatePurchase = async (id: number, data: any) => {
    return await api.put(`/purchases/history/${id}`, data);
};