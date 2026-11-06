import { useEffect, useState } from "react";
import type { Phrase } from "../types";
import { getPhrases, createPhrase, updatePhrase, deletePhrase } from "../services/phrasebankService";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Plus, SearchIcon, Filter, Copy } from "lucide-react";
import PhrasebankModal from "../components/PhrasebankModal";

function PhrasebankPage() {
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter State
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
        const timer = setTimeout(() => {
            setDebouncedKeyword(keywordFilter);
        }, 500);
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
            alert("Failed to delete phrase.");
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading && phrases.length === 0) return <p>Loading Phrasebank...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Phrasebank</h1>

            <div className="flex flex-row justify-between">
                <section className="flex flex-row gap-1">
                    {/* Search Bar */}
                    <div>
                        <InputGroup>
                            <InputGroupInput 
                                placeholder="Search keyword..." 
                                value={keywordFilter}
                                onChange={(e) => setKeywordFilter(e.target.value)}
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
                h-[calc(100vh-200px)] overflow-y-auto overflow-x-auto">
                
                {/* 
                  Using raw <table> to fix the sticky header issue we discussed earlier 
                */}
                <table className="w-full caption-bottom text-sm border-collapse">
                    <TableHeader>
                        <TableRow className="sticky top-0 bg-[#efe6dd] hover:bg-[#efe6dd] z-20">
                            <TableHead className="font-bold text-[#161111] w-1/4">Title</TableHead>
                            <TableHead className="font-bold text-[#161111] w-1/2">Phrase</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {phrases.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="max-w-50 truncate font-medium">{p.phrase_title}</TableCell>
                                <TableCell className="max-w-50 truncate">{p.phrase}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button 
                                            className="h-6 text-xs rounded-xs cursor-pointer bg-blue-600 hover:bg-blue-700 text-white" 
                                            onClick={() => handleCopy(p.phrase)}
                                        >
                                            <Copy className="w-3 h-3 mr-1" /> Copy
                                        </Button>
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(p)}>
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="destructive"
                                            className="h-6 text-xs rounded-xs cursor-pointer" 
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

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