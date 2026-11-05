export interface Employee {
    id: number;
    employee_name: string;
    employee_department: string;
    employee_email: string;
    contact_no: string;
    status: string;
}

export interface Fedex {
    id: number;
    visit_date: string; // Dates come back as strings (e.g., "2026-10-24") from FastAPI
    visit_reason: string;
    companions: string;
    departure_office: string;
    arrival_fedex: string;
    departure_fedex: string;
    arrival_office: string;
}

export interface Tiktok {
    id: number;
    live_date: string; // Dates come back as strings (e.g., "2026-10-24")
    hosts: string;
    no_applicants: number; // This is an integer in the backend
}

export interface Phrase {
    id: number;
    phrase_title: string;
    phrase: string;
}

export interface Purchase {
    id: number;
    purchase_date: string;
    source: string; // "Shopee" or "TikTok Shop"
    item: string;
    price: number;
    beneficiary: string;
}

export interface Contact {
    id: number;
    contact_name: string;
    contact_number: string;
    purpose: string;
}
export interface Account {
    id: number;
    account: string;
    username_email: string;
    password: string;
    category: string; 
}

export interface Report {
    id: number;
    problem: string;
    description: string;
    solution: string;
    reported_by: string;
    report_date: string; // Dates come back as strings (e.g., "2026-11-05")
}

export interface Deadline {
    id: number;
    due_date: string;
    title: string;
    beneficiary: string;
    completed: boolean;
}

// Dashboard Types
export interface EmployeeStats {
    count_active: number;
    count_per_dept: Record<string, number>;
}

export interface TiktokStats {
    count_tiktok_lives: number;
    count_applicants: number;
    count_applicants_per_month: Record<string, number>;
    count_applicants_current_month: number;
}

export interface FedexStats {
    count_visits: number;
    recent_visit_date: string | null;
    recent_visit_reason: string | null;
}

export interface ReportsStats {
    count_reports: number;
    count_purchases: number;
    pending: number;
}