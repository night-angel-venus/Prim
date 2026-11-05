import { useEffect, useState } from "react";
import type { Employee } from "../types";
import { getEmployees, createEmployee, updateEmployee, archiveEmployee } from "../services/employeeService";
import EmployeeModal from "../components/EmployeeModal";

function Employees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('Active'); // Default to Active

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Employee | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            // Pass both filters
            const data = await getEmployees(departmentFilter, statusFilter);
            setEmployees(data);
        } catch (err) {
            setError('Failed to fetch employees.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [departmentFilter, statusFilter]); // Add statusFilter to the dependency array
    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setEditingData(emp);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updateEmployee(editingId, payload);
            } else {
                await createEmployee(payload);
            }
            setIsModalOpen(false);
            loadData(); // Refresh the list
        } catch (err) {
            alert("Action failed.");
        }
    };

    const handleArchive = async (id: number) => {
        if (!window.confirm("Archive this employee?")) return;
        try {
            await archiveEmployee(id);
            loadData();
        } catch (err) {
            alert("Failed to archive.");
        }
    };

    if (loading) return <p>Loading Employees...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Employees</h1>
            <div>
                <label>Filter by Department: </label>
                <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="Admin/HR">Admin/HR</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Operations">Operations</option>
                    <option value="Recruitment">Recruitment</option>
                </select>
            </div>

            <div>
                    <label>Filter by Status: </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="Active">Active</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>

            <button onClick={handleOpenAdd}>New</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th><th>Name</th><th>Department</th><th>Email</th><th>Contact No.</th><th>Status</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.employee_name}</td>
                            <td>{emp.employee_department}</td>
                            <td>{emp.employee_email}</td>
                            <td>{emp.contact_no}</td>
                            <td>{emp.status}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(emp)}>Edit</button>
                                <button onClick={() => handleArchive(emp.id)} disabled={emp.status === 'Archived'}>Archive</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default Employees;