import api from "../api";
import type { Employee } from "../types";

export const getEmployees = async (department?: string, status?: string) => {
    let url = '/directory/employees?';
    if (department) url += `department=${department}&`;
    if (status) url += `status=${status}`;
    
    const response = await api.get<Employee[]>(url);
    return response.data;
};

export const createEmployee = async (data: any) => {
    return await api.post('/directory/employees', data);
};

export const updateEmployee = async (id: number, data: any) => {
    return await api.put(`/directory/employees/${id}`, data);
};

export const archiveEmployee = async (id: number) => {
    return await api.put(`/directory/archive/${id}`);
};