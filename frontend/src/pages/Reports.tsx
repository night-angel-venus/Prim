import { useEffect, useState } from "react";
import type { Report } from "../types";
import { getReports, createReport, updateReport } from "../services/reportService";
import ReportModal from "../components/ReportModal";
import {
    TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { CalendarIcon, Plus, SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";

function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [reportedByFilter, setReportedByFilter] = useState('');
    const [problemFilter, setProblemFilter] = useState('');
    const [solutionFilter, setSolutionFilter] = useState('');

    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

    const [debouncedReportedBy, setDebouncedReportedBy] = useState('');
    const [debouncedProblem, setDebouncedProblem] = useState('');
    const [debouncedSolution, setDebouncedSolution] = useState('');
    const [debouncedDate, setDebouncedDate] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Report | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getReports(debouncedReportedBy, debouncedProblem, debouncedSolution, debouncedDate);
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

            setDebouncedDate(dateFilter ? format(dateFilter, "yyyy-MM-dd"):'')

        }, 500);
        return () => clearTimeout(timer);
    }, [reportedByFilter, problemFilter, solutionFilter, dateFilter]);

    useEffect(() => { loadData(); }, [debouncedReportedBy, debouncedProblem, debouncedSolution, debouncedDate]);

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
            <h1 className="font-bold mb-5 text-2xl">Activity Log</h1>

            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="w-full md:w-auto">
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="outline" className="w-full md:w-[200px] justify-start bg-[#efe6dd] text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateFilter ? format(dateFilter, "PPP") : <span>Filter by Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#efe6dd]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dateFilter}
                                    onSelect={setDateFilter}
                                />
                                {dateFilter && (
                                    <div className="p-2 border-t">
                                        <Button 
                                            variant="ghost" 
                                            className="w-full h-8 text-xs cursor-pointer" 
                                            onClick={() => setDateFilter(undefined)}
                                        >
                                            Clear Date
                                        </Button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search problem/task..." value={problemFilter} onChange={(e) => setProblemFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search solution/action..." value={solutionFilter} onChange={(e) => setSolutionFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search who reported..." value={reportedByFilter} onChange={(e) => setReportedByFilter(e.target.value)} />
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
                            <TableHead className="font-bold text-[#161111]">Date</TableHead>
                            <TableHead className="font-bold text-[#161111]">Problem/Task</TableHead>
                            <TableHead className="font-bold text-[#161111]">Description</TableHead>
                            <TableHead className="font-bold text-[#161111]">Solution/Action</TableHead>
                            <TableHead className="font-bold text-[#161111]">Reported By</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell className="max-w-[150px] truncate font-medium">
                                    {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </TableCell>
                                <TableCell className="whitespace-normal break-words max-w-[200px]">
                                    {r.problem}
                                </TableCell>
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

                {reports.length === 0 && (
                        <div className="flex items-center justify-center h-full w-full m-auto text-gray-500">
                            You have no activities!
                        </div>
                        )}
            </main>

            <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default ReportsPage;