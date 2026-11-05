import { useEffect, useState } from "react";
import type { Deadline } from "../types";
import { getDeadlines, createDeadline, updateDeadline, toggleDeadlineComplete } from "../services/deadlineService";
import DeadlineModal from "../components/DeadlineModal";

function DeadlinesPage() {
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [statusFilter, setStatusFilter] = useState<string>(''); // '', 'true', or 'false'
    const [keywordFilter, setKeywordFilter] = useState('');
    const [beneficiaryFilter, setBeneficiaryFilter] = useState('');

    // Debounced filters
    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [debouncedBeneficiary, setDebouncedBeneficiary] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Deadline | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            let isCompleted: boolean | undefined = undefined;
            if (statusFilter === 'true') isCompleted = true;
            if (statusFilter === 'false') isCompleted = false;

            const data = await getDeadlines(isCompleted, debouncedKeyword, debouncedBeneficiary);
            setDeadlines(data);
            setError(''); 
        } catch (err) {
            setError('Failed to fetch deadlines.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keywordFilter);
            setDebouncedBeneficiary(beneficiaryFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [keywordFilter, beneficiaryFilter]);

    // Fetch Effect
    useEffect(() => {
        loadData();
    }, [statusFilter, debouncedKeyword, debouncedBeneficiary]); 

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (deadline: Deadline) => {
        setEditingId(deadline.id);
        setEditingData(deadline);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updateDeadline(editingId, payload);
            } else {
                await createDeadline(payload);
            }
            setIsModalOpen(false);
            loadData(); 
        } catch (err) {
            alert("Action failed.");
        }
    };

    // Checkbox Handler
    const handleToggleComplete = async (id: number, currentStatus: boolean) => {
        try {
            await toggleDeadlineComplete(id, !currentStatus);
            loadData(); // Refresh to update the UI
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    if (loading && deadlines.length === 0) return <p>Loading Deadlines...</p>;

    return (
        <div>
            <h1>Deadlines & Tasks</h1>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Filter Status: </label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Tasks</option>
                        <option value="false">Pending</option>
                        <option value="true">Completed</option>
                    </select>
                </div>
                <div>
                    <label>Search Title: </label>
                    <input type="text" value={keywordFilter} onChange={(e) => setKeywordFilter(e.target.value)} />
                </div>
                <div>
                    <label>Search Beneficiary: </label>
                    <input type="text" value={beneficiaryFilter} onChange={(e) => setBeneficiaryFilter(e.target.value)} />
                </div>
            </div>

            <button onClick={handleOpenAdd}>New Deadline</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Done</th>
                        <th>Due Date</th>
                        <th>Title</th>
                        <th>Beneficiary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {deadlines.map((d) => (
                        <tr key={d.id}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={d.completed} 
                                    onChange={() => handleToggleComplete(d.id, d.completed)} 
                                />
                            </td>
                            {/* Strikethrough if completed */}
                            <td style={{ textDecoration: d.completed ? 'line-through' : 'none' }}>
                                {d.due_date}
                            </td>
                            <td style={{ textDecoration: d.completed ? 'line-through' : 'none' }}>
                                {d.title}
                            </td>
                            <td>{d.beneficiary}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(d)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DeadlineModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default DeadlinesPage;