import api from "../api";
import type { Account } from "../types";

export const getAccounts = async (category?: string) => {
    let url = '/accounts/admin';
    if (category) url += `?category=${category}`;
    
    const response = await api.get<Account[]>(url);
    return response.data;
};

export const createAccount = async (data: any) => {
    return await api.post('/accounts/admin', data);
};

export const updateAccount = async (id: number, data: any) => {
    return await api.put(`/accounts/admin/${id}`, data);
};