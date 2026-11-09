import api from "../api";
import type { Report } from "../types";

export const getReports = async (reportedBy?: string, problem?: string, solution?: string) => {
    const params = new URLSearchParams();
    if (reportedBy) params.append('reported_by', reportedBy);
    if (problem) params.append('problem', problem);
    if (solution) params.append('solution', solution);
    
    const url = `/reports/logs?${params.toString()}`;
    const response = await api.get<Report[]>(url);
    return response.data;
};

export const createReport = async (data: any) => {
    return await api.post('/reports/logs', data);
};

export const updateReport = async (id: number, data: any) => {
    return await api.put(`/reports/logs/${id}`, data);
};