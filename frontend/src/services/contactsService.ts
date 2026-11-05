import api from "../api";
import type { Contact } from "../types";

export const getContacts = async (name?: string, purpose?: string) => {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (purpose) params.append('purpose', purpose);
    
    const url = `/contacts/items?${params.toString()}`;
    const response = await api.get<Contact[]>(url);
    return response.data;
};

export const createContact = async (data: any) => {
    return await api.post('/contacts/items', data);
};

export const updateContact = async (id: number, data: any) => {
    return await api.put(`/contacts/items/${id}`, data);
};