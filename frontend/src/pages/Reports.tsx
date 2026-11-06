import { useEffect, useState } from "react";
import type { Report } from "../types";
import { getReports, createReport, updateReport } from "../services/reportService";
import ReportModal from "../components/ReportModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Plus, SearchIcon } from "lucide-react";

function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [reportedByFilter, setReportedByFilter] = useState('');
    const [problemFilter, setProblemFilter] = useState('');
    const [solutionFilter, setSolutionFilter] = useState('');
    
    // Debounced filters
    const [debouncedReportedBy, setDebouncedReportedBy] = useState('');
    const [debouncedProblem, setDebouncedProblem] = useState('');
    const [debouncedSolution, setDebouncedSolution] = useState('');

    // Modal State
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

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedReportedBy(reportedByFilter);
            setDebouncedProblem(problemFilter);
            setDebouncedSolution(solutionFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [reportedByFilter, problemFilter, solutionFilter]);

    // Fetch Effect
    useEffect(() => {
        loadData();
    }, [debouncedReportedBy, debouncedProblem, debouncedSolution]); 

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (report: Report) => {
        setEditingId(report.id);
        setEditingData(report);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updateReport(editingId, payload);
            } else {
                await createReport(payload);
            }
            setIsModalOpen(false);
            loadData(); 
        } catch (err) {
            alert("Action failed.");
        }
    };

    if (loading && reports.length === 0) return <p>Loading Reports...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Issue Reports</h1>
            
            <div className="flex flex-row justify-between">
                <section className="flex flex-row gap-1">
                    <div>
                        <InputGroup>
                            <InputGroupInput 
                                placeholder="Search problem..." 
                                value={problemFilter}
                                onChange={(e) => setProblemFilter(e.target.value)}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup>
                            <InputGroupInput 
                                placeholder="Search solution..." 
                                value={solutionFilter}
                                onChange={(e) => setSolutionFilter(e.target.value)}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div>
                        <InputGroup>
                            <InputGroupInput 
                                placeholder="Search reported by..." 
                                value={reportedByFilter}
                                onChange={(e) => setReportedByFilter(e.target.value)}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </section>

                <section>
                    <Button onClick={handleOpenAdd} className='w-20 bg-[#e5b85c] text-[#161111] cursor-pointer hover:bg-[#e5b85c]/60'>
                        <span className="flex flex-row items-center justify-center">
                            <Plus />
                            New
                        </span>
                    </Button>
                </section>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <main className="mt-5 p-1 rounded-sm
                border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md 
                shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)]
                h-[calc(100vh-250px)] overflow-y-auto">
                
                <Table className="w-full text-left overflow-visible">
                    <TableHeader>
                        <TableRow className="sticky top-0  hover:bg-[#efe6dd] z-10 ">
                            <TableHead className="font-bold text-[#161111]">Date</TableHead>
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
                                <TableCell className="max-w-[200px] truncate">{r.report_date}</TableCell>
                                <TableCell className="max-w-[200px] truncate font-medium">{r.problem}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{r.description}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{r.solution}</TableCell>
                                <TableCell>{r.reported_by}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(r)}>
                                            Edit
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default ReportsPage;