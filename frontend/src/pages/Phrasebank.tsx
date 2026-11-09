import { useEffect, useState } from "react";
import type { Phrase } from "../types";
import { getPhrases, createPhrase, updatePhrase, deletePhrase } from "../services/phrasebankService";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Plus, SearchIcon, Copy } from "lucide-react";
import PhraseModal from "../components/PhrasebankModal";

function PhrasebankPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [keywordFilter, setKeywordFilter] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Phrase | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getPhrases(debouncedKeyword);
            setPhrases(data);
            setError('');
        } catch (err) { setError('Failed to fetch phrases.'); } finally { setLoading(false); }
    };

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedKeyword(keywordFilter), 500);
        return () => clearTimeout(timer);
    }, [keywordFilter]);

    useEffect(() => { loadData(); }, [debouncedKeyword]);

    const handleOpenAdd = () => { setEditingId(null); setEditingData(null); setIsModalOpen(true); };
    const handleOpenEdit = (phrase: Phrase) => { setEditingId(phrase.id); setEditingData(phrase); setIsModalOpen(true); };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) await updatePhrase(editingId, payload);
            else await createPhrase(payload);
            setIsModalOpen(false);
            loadData();
        } catch (err) { alert("Action failed."); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this phrase?")) return;
        try { await deletePhrase(id); loadData(); } catch (err) { alert("Failed to delete."); }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading && phrases.length === 0) return <p>Loading Phrasebank...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Phrasebank</h1>

            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search keyword..." value={keywordFilter} onChange={(e) => setKeywordFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>
                </section>

                <section className="w-full md:w-auto">
                    <Button onClick={handleOpenAdd} className='w-full md:w-24 bg-[#e5b85c] text-[#161111] cursor-pointer hover:bg-[#e5b85c]/60'>
                        <span className="flex flex-row items-center justify-center gap-1"><Plus size={16} /> New</span>
                    </Button>
                </section>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <main className="mt-5 p-1 rounded-sm border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] h-[calc(100vh-250px)] overflow-y-auto overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-collapse min-w-[600px]">
                    <TableHeader>
                        <TableRow className="bg-[#efe6dd] hover:bg-[#efe6dd] z-20">
                            <TableHead className="font-bold text-[#161111] w-1/4">Title</TableHead>
                            <TableHead className="font-bold text-[#161111] w-1/2">Phrase</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {phrases.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="max-w-[200px] truncate font-medium">{p.phrase_title}</TableCell>
                                <TableCell className="whitespace-normal break-words max-w-[400px]">{p.phrase}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer bg-[#e5b85c] hover:bg-[#e5b85c]/80 text-[#161111]" onClick={() => handleCopy(p.phrase)}>
                                            <Copy className="w-3 h-3 mr-1" /> Copy
                                        </Button>
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer w-20" onClick={() => handleOpenEdit(p)}>Edit</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

            <PhraseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default PhrasebankPage;