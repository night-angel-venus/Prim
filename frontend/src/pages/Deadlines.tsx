import { useEffect, useState } from "react";
import type { Deadline } from "../types";
import { getDeadlines, createDeadline, updateDeadline, toggleDeadlineComplete } from "../services/deadlineService";
import DeadlineModal from "../components/DeadlineModal";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
    TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Plus, SearchIcon, Filter } from "lucide-react";

function DeadlinesPage() {
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [statusFilter, setStatusFilter] = useState<string>(''); 
    const [keywordFilter, setKeywordFilter] = useState('');
    const [beneficiaryFilter, setBeneficiaryFilter] = useState('');

    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [debouncedBeneficiary, setDebouncedBeneficiary] = useState('');

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keywordFilter);
            setDebouncedBeneficiary(beneficiaryFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [keywordFilter, beneficiaryFilter]);

    useEffect(() => { loadData(); }, [statusFilter, debouncedKeyword, debouncedBeneficiary]); 

    const handleOpenAdd = () => { setEditingId(null); setEditingData(null); setIsModalOpen(true); };
    const handleOpenEdit = (deadline: Deadline) => { setEditingId(deadline.id); setEditingData(deadline); setIsModalOpen(true); };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) await updateDeadline(editingId, payload);
            else await createDeadline(payload);
            setIsModalOpen(false);
            loadData(); 
        } catch (err) { alert("Action failed."); }
    };

    const handleToggleComplete = async (id: number, currentStatus: boolean) => {
        try {
            await toggleDeadlineComplete(id, !currentStatus);
            loadData(); 
        } catch (err) { alert("Failed to update status."); }
    };

    if (loading && deadlines.length === 0) return <p>Loading Deadlines...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Deadlines</h1>
            
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div>
                        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                            <TabsList className='bg-[#e5b85c] text-[#161111] w-full md:w-auto flex-wrap h-auto'>
                                <span className="flex flex-row gap-1 text-xs font-bold text-center mx-2 items-center py-1">
                                    Filters <Filter className="size-3"/>  
                                </span>
                                <TabsTrigger value="" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">All</TabsTrigger>
                                <TabsTrigger value="false" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Pending</TabsTrigger>
                                <TabsTrigger value="true" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Completed</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search title..." value={keywordFilter} onChange={(e) => setKeywordFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>
                    
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search beneficiary..." value={beneficiaryFilter} onChange={(e) => setBeneficiaryFilter(e.target.value)} />
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
                <table className="w-full caption-bottom text-sm border-collapse min-w-[600px]">
                    <TableHeader>
                        {/* Removed sticky classes here */}
                        <TableRow className="bg-[#efe6dd]/50 hover:bg-[#efe6dd]/50">
                            <TableHead className="font-bold text-[#161111] w-[50px]">Done</TableHead>
                            <TableHead className="font-bold text-[#161111]">Due Date</TableHead>
                            <TableHead className="font-bold text-[#161111]">Title</TableHead>
                            <TableHead className="font-bold text-[#161111]">Beneficiary</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deadlines.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 cursor-pointer"
                                        checked={d.completed} 
                                        onChange={() => handleToggleComplete(d.id, d.completed)} 
                                    />
                                </TableCell>
                                <TableCell className={`max-w-[150px] truncate ${d.completed ? 'line-through text-gray-500' : ''}`}>
                                    {d.due_date}
                                </TableCell>
                                <TableCell className={`max-w-[200px] truncate font-medium ${d.completed ? 'line-through text-gray-500' : ''}`}>
                                    {d.title}
                                </TableCell>
                                <TableCell>{d.beneficiary}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(d)}>Edit</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

            <DeadlineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default DeadlinesPage;