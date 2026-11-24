import { useEffect, useState } from "react";
import type { Employee } from "../types";
import { getEmployees, createEmployee, updateEmployee, archiveEmployee } from "../services/employeeService";
import EmployeeModal from "../components/EmployeeModal";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Plus, Filter } from "lucide-react";

function Employees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('Active');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Employee | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getEmployees(departmentFilter, statusFilter);
            setEmployees(data);
        } catch (err) {
            setError('Failed to fetch employees.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [departmentFilter, statusFilter]);

    const handleOpenAdd = () => { setEditingId(null); setEditingData(null); setIsModalOpen(true); };
    const handleOpenEdit = (emp: Employee) => { setEditingId(emp.id); setEditingData(emp); setIsModalOpen(true); };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) await updateEmployee(editingId, payload);
            else await createEmployee(payload);
            setIsModalOpen(false);
            loadData();
        } catch (err) { alert("Action failed."); }
    };

    const handleArchive = async (id: number) => {
        if (!window.confirm("Archive this employee?")) return;
        try {
            await archiveEmployee(id);
            loadData();
        } catch (err) { alert("Failed to archive."); }
    };

    if (loading && employees.length === 0) return <p>Loading Employees...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Employees</h1>

            {/* Responsive Header Area */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">

                    {/* Department Tabs */}
                    <div>
                        

                        <Tabs value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <TabsList className='bg-[#e5b85c] text-[#161111] w-full md:w-auto flex-wrap h-auto'>
                                <span className="flex flex-row gap-1 text-xs font-bold text-center mx-2 items-center py-1">
                                    Filters <Filter className="size-3" />
                                </span>
                                <TabsTrigger value="" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">All</TabsTrigger>
                                <TabsTrigger value="Admin/HR" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Admin</TabsTrigger>
                                <TabsTrigger value="Operations" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Operations</TabsTrigger>
                                <TabsTrigger value="Accounting" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Accounting</TabsTrigger>
                                <TabsTrigger value="Recruitment" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Recruitment</TabsTrigger>
                                <TabsTrigger value="IT" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">IT</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Status Tabs */}
                    <div>
                        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                            <TabsList className='bg-[#e5b85c] text-[#161111] w-full md:w-auto'>
                                <TabsTrigger value="Active" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Active</TabsTrigger>
                                <TabsTrigger value="Archived" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Archived</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </section>

                <section className="w-full md:w-auto">
                    <Button onClick={handleOpenAdd} className='w-full md:w-24 bg-[#e5b85c] text-[#161111] cursor-pointer hover:bg-[#e5b85c]/60'>
                        <span className="flex flex-row items-center justify-center gap-1">
                            <Plus size={16} /> New
                        </span>
                    </Button>
                </section>
            </div>

            {/* Responsive Table Container */}
            <main className="mt-5 p-1 rounded-sm border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] h-[calc(100vh-250px)] overflow-y-auto overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-collapse min-w-[600px]">
                    <TableHeader>
                        <TableRow className=" hover:bg-[#efe6dd] z-20 border-b ">
                            <TableHead className="font-bold text-[#161111]">Name</TableHead>
                            <TableHead className="font-bold text-[#161111]">Department</TableHead>
                            <TableHead className="font-bold text-[#161111]">Email</TableHead>
                            <TableHead className="font-bold text-[#161111]">Contact No.</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map(emp => (
                            <TableRow key={emp.id}>
                                <TableCell className="max-w-[200px] font-semibold truncate">{emp.employee_name}</TableCell>
                                <TableCell>{emp.employee_department}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{emp.employee_email}</TableCell>
                                <TableCell>{emp.contact_no}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(emp)}>Edit</Button>
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleArchive(emp.id)} disabled={emp.status === 'Archived'}>Archive</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

            <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default Employees;