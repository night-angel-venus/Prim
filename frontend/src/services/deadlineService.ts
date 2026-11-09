import api from "../api";
import type { Deadline } from "../types";

export const getDeadlines = async (completed?: boolean, keyword?: string, beneficiary?: string) => {
    const params = new URLSearchParams();
    
    if (completed !== undefined) params.append('completed', String(completed));
    if (keyword) params.append('keyword', keyword);
    if (beneficiary) params.append('beneficiary', beneficiary);
    
    const url = `/deadlines/items?${params.toString()}`;
    const response = await api.get<Deadline[]>(url);
    return response.data;
};

export const createDeadline = async (data: any) => {
    return await api.post('/deadlines/items', data);
};

export const updateDeadline = async (id: number, data: any) => {
    return await api.put(`/deadlines/items/${id}`, data);
};

export const toggleDeadlineComplete = async (id: number, completed: boolean) => {
    return await api.put(`/deadlines/complete/${id}`, { completed });
};