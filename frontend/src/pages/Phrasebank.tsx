import { useEffect, useState } from "react";
import type { Phrase } from "../types";
import { getPhrases, createPhrase, updatePhrase, deletePhrase } from "../services/phrasebankService";
import PhrasebankModal from "../components/PhrasebankModal";

function PhrasebankPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filter
    const [keywordFilter, setKeywordFilter] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Phrase | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getPhrases(debouncedKeyword);
            setPhrases(data);
            setError(''); 
        } catch (err) {
            setError('Failed to fetch phrases.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedKeyword(keywordFilter), 500);
        return () => clearTimeout(timer);
    }, [keywordFilter]);

    // Fetch Effect
    useEffect(() => {
        loadData();
    }, [debouncedKeyword]); 

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (phrase: Phrase) => {
        setEditingId(phrase.id);
        setEditingData(phrase);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updatePhrase(editingId, payload);
            } else {
                await createPhrase(payload);
            }
            setIsModalOpen(false);
            loadData(); 
        } catch (err) {
            alert("Action failed.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this phrase?")) return;
        try {
            await deletePhrase(id);
            loadData();
        } catch (err) {
            alert("Failed to delete.");
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading && phrases.length === 0) return <p>Loading Phrasebank...</p>;

    return (
        <div>
            <h1>Phrasebank</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <label>Search Keywords: </label>
                <input 
                    type="text" 
                    placeholder="Search title or phrase..."
                    value={keywordFilter} 
                    onChange={(e) => setKeywordFilter(e.target.value)} 
                />
            </div>

            <button onClick={handleOpenAdd}>New Phrase</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Phrase</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {phrases.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.phrase_title}</td>
                            <td>{p.phrase}</td>
                            <td>
                                <button onClick={() => handleCopy(p.phrase)}>Copy</button>
                                <button onClick={() => handleOpenEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PhrasebankModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default PhrasebankPage;