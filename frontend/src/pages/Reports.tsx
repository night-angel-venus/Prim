import { useEffect, useState } from "react";
import type { Report } from "../types";
import { getReports, createReport, updateReport } from "../services/reportService";
import ReportModal from "../components/ReportModal";
import {
    TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Plus, SearchIcon } from "lucide-react";

function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [reportedByFilter, setReportedByFilter] = useState('');
    const [problemFilter, setProblemFilter] = useState('');
    const [solutionFilter, setSolutionFilter] = useState('');
    
    const [debouncedReportedBy, setDebouncedReportedBy] = useState('');
    const [debouncedProblem, setDebouncedProblem] = useState('');
    const [debouncedSolution, setDebouncedSolution] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Report | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getReports(debouncedReportedBy, debouncedProblem, debouncedSolution);
            setReports(data);
            setError(''); 
        } catch (err) {
            setError('Failed to fetch reports.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedReportedBy(reportedByFilter);
            setDebouncedProblem(problemFilter);
            setDebouncedSolution(solutionFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [reportedByFilter, problemFilter, solutionFilter]);

    useEffect(() => { loadData(); }, [debouncedReportedBy, debouncedProblem, debouncedSolution]); 

    const handleOpenAdd = () => { setEditingId(null); setEditingData(null); setIsModalOpen(true); };
    const handleOpenEdit = (report: Report) => { setEditingId(report.id); setEditingData(report); setIsModalOpen(true); };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) await updateReport(editingId, payload);
            else await createReport(payload);
            setIsModalOpen(false);
            loadData(); 
        } catch (err) { alert("Action failed."); }
    };

    if (loading && reports.length === 0) return <p>Loading Reports...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Issue Reports</h1>
            
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search problem..." value={problemFilter} onChange={(e) => setProblemFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search solution..." value={solutionFilter} onChange={(e) => setSolutionFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search reported by..." value={reportedByFilter} onChange={(e) => setReportedByFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
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

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <main className="mt-5 p-1 rounded-sm border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] h-[calc(100vh-250px)] overflow-y-auto overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-collapse min-w-[800px]">
                    <TableHeader>
                        <TableRow className="bg-[#efe6dd]/50 hover:bg-[#efe6dd]/50">
                            <TableHead className="font-bold text-[#161111]">Problem</TableHead>
                            <TableHead className="font-bold text-[#161111]">Description</TableHead>
                            <TableHead className="font-bold text-[#161111]">Solution</TableHead>
                            <TableHead className="font-bold text-[#161111]">Reported By</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell className="max-w-[150px] truncate font-medium">{r.problem}</TableCell>
                                <TableCell className="whitespace-normal break-words max-w-[250px]">{r.description}</TableCell>
                                <TableCell className="whitespace-normal break-words max-w-[250px]">{r.solution}</TableCell>
                                <TableCell>{r.reported_by}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(r)}>Edit</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

            <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default ReportsPage;