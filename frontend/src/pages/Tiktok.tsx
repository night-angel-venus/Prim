import { useEffect, useState } from "react";
import type { Tiktok } from "../types";
import { getTiktok, createTiktok, updateTiktok } from "../services/tiktokService";
import TiktokModal from "../components/TiktokModal";

function TiktokPage() {
    const [tiktokLogs, setTiktokLogs] = useState<Tiktok[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [hostFilter, setHostFilter] = useState('');
    const [noLiveFilter, setNoLiveFilter] = useState<string>(''); // '', 'true', or 'false'
    
    // Debounced filter
    const [debouncedHost, setDebouncedHost] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Tiktok | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            // Convert noLiveFilter string to boolean/undefined for the service
            let isNoLive: boolean | undefined = undefined;
            if (noLiveFilter === 'true') isNoLive = true;
            if (noLiveFilter === 'false') isNoLive = false;

            const data = await getTiktok(debouncedHost, isNoLive);
            setTiktokLogs(data);
            setError(''); 
        } catch (err) {
            setError('Failed to fetch TikTok logs.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedHost(hostFilter);
        }, 500);

        return () => clearTimeout(timer);
    }, [hostFilter]);

    // Fetch Effect
    useEffect(() => {
        loadData();
    }, [debouncedHost, noLiveFilter]); 

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (log: Tiktok) => {
        setEditingId(log.id);
        setEditingData(log);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updateTiktok(editingId, payload);
            } else {
                await createTiktok(payload);
            }
            setIsModalOpen(false);
            loadData(); 
        } catch (err) {
            alert("Action failed. Please check the form data.");
        }
    };

    if (loading && tiktokLogs.length === 0) return <p>Loading TikTok Logs...</p>;

    return (
        <div>
            <h1>TikTok Live Logs</h1>
            
            {/* Filters */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Filter by Host: </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Ms. Hazel"
                        value={hostFilter} 
                        onChange={(e) => setHostFilter(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Filter by Status: </label>
                    <select value={noLiveFilter} onChange={(e) => setNoLiveFilter(e.target.value)}>
                        <option value="">All Days</option>
                        <option value="false">Live Only (Applicants &gt; 0)</option>
                        <option value="true">No Live Only (0 Applicants)</option>
                    </select>
                </div>
            </div>

            <button onClick={handleOpenAdd}>New Log</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date of Live</th>
                        <th>Hosts</th>
                        <th>No. of Applicants</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tiktokLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.live_date}</td>
                            <td>{log.hosts}</td>
                            <td>{log.no_applicants}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(log)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <TiktokModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default TiktokPage;