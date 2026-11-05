import { useEffect, useState } from "react";
import type { Fedex } from "../types";
import { getFedex, createFedex, updateFedex } from "../services/fedexService";
import FedexModal from "../components/FedexModal";

function FedexPage() {
    const [fedexLogs, setFedexLogs] = useState<Fedex[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // 1. Immediate state for the input boxes
    const [companionFilter, setCompanionFilter] = useState('');
    const [reasonFilter, setReasonFilter] = useState('');

    // 2. Delayed state for the API call (Debouncing)
    const [debouncedCompanion, setDebouncedCompanion] = useState('');
    const [debouncedReason, setDebouncedReason] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Fedex | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            // Use the debounced (delayed) values here
            const data = await getFedex(debouncedCompanion, debouncedReason);
            setFedexLogs(data);
            setError(''); 
        } catch (err) {
            setError('Failed to fetch FedEx logs.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce Effect: Wait 500ms after typing stops to update the delayed state
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCompanion(companionFilter);
            setDebouncedReason(reasonFilter);
        }, 500);

        return () => clearTimeout(timer);
    }, [companionFilter, reasonFilter]);

    // Fetch Effect: Trigger API call ONLY when the delayed states change
    useEffect(() => {
        loadData();
    }, [debouncedCompanion, debouncedReason]); 

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (log: Fedex) => {
        setEditingId(log.id);
        setEditingData(log);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updateFedex(editingId, payload);
            } else {
                await createFedex(payload);
            }
            setIsModalOpen(false);
            loadData(); 
        } catch (err) {
            alert("Action failed. Please check the form data.");
        }
    };

    if (loading && fedexLogs.length === 0) return <p>Loading FedEx Logs...</p>;

    return (
        <div>
            <h1>FedEx Visit Logs</h1>
            
            {/* Filters */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Filter by Reason: </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Training"
                        value={reasonFilter} 
                        onChange={(e) => setReasonFilter(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Filter by Companion: </label>
                    <input 
                        type="text" 
                        placeholder="e.g. John"
                        value={companionFilter} 
                        onChange={(e) => setCompanionFilter(e.target.value)} 
                    />
                </div>
            </div>

            <button onClick={handleOpenAdd}>New Log</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Reason</th>
                        <th>Companions</th>
                        <th>Dep. Office</th>
                        <th>Arr. CRK</th>
                        <th>Dep. CRK</th>
                        <th>Arr. Office</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fedexLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.visit_date}</td>
                            <td>{log.visit_reason}</td>
                            <td>{log.companions}</td>
                            <td>{log.departure_office}</td>
                            <td>{log.arrival_fedex}</td>
                            <td>{log.departure_fedex}</td>
                            <td>{log.arrival_office}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(log)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <FedexModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default FedexPage;