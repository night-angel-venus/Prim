import { useEffect, useState } from "react";
import type { Report } from "../types";
import { getReports, createReport, updateReport } from "../services/reportService";
import ReportModal from "../components/ReportModal";

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
            <h1>Issue Reports</h1>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Search Problem: </label>
                    <input type="text" value={problemFilter} onChange={(e) => setProblemFilter(e.target.value)} />
                </div>
                <div>
                    <label>Search Solution: </label>
                    <input type="text" value={solutionFilter} onChange={(e) => setSolutionFilter(e.target.value)} />
                </div>
                <div>
                    <label>Search Reported By: </label>
                    <input type="text" value={reportedByFilter} onChange={(e) => setReportedByFilter(e.target.value)} />
                </div>
            </div>

            <button onClick={handleOpenAdd}>New Report</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Problem</th>
                        <th>Description</th>
                        <th>Solution</th>
                        <th>Reported By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((r) => (
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.report_date}</td>
                            <td>{r.problem}</td>
                            <td>{r.description}</td>
                            <td>{r.solution}</td>
                            <td>{r.reported_by}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(r)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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