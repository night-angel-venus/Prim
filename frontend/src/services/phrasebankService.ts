import api from "../api";
import type { Phrase } from "../types";

export const getPhrases = async (keyword?: string) => {
    let url = '/phrasebank/items?';
    if (keyword) url += `keyword=${keyword}`;
    
    const response = await api.get<Phrase[]>(url);
    return response.data;
};

export const createPhrase = async (data: any) => {
    return await api.post('/phrasebank/items', data);
};

export const updatePhrase = async (id: number, data: any) => {
    return await api.put(`/phrasebank/items/${id}`, data);
};

export const deletePhrase = async (id: number) => {
    return await api.delete(`/phrasebank/items/${id}`);
};