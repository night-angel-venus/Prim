import api from "../api";
import type { EmployeeStats, TiktokStats, FedexStats, ReportsStats } from "../types";

export const getEmployeeStats = async () => {
    const response = await api.get<EmployeeStats>('/dashboard/employees');
    return response.data;
};

export const getTiktokStats = async () => {
    const response = await api.get<TiktokStats>('/dashboard/tiktok');
    return response.data;
};

export const getFedexStats = async () => {
    const response = await api.get<FedexStats>('/dashboard/fedex');
    return response.data;
};

export const getReportsStats = async () => {
    const response = await api.get<ReportsStats>('/dashboard/reports');
    return response.data;
};