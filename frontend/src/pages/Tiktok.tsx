import { useEffect, useState } from "react";
import type { Tiktok } from "../types";
import { getTiktok, createTiktok, updateTiktok } from "../services/tiktokService";
import TiktokModal from "../components/TiktokModal";
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
import { Plus, SearchIcon, Filter } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";

function TiktokPage() {
    const [tiktokLogs, setTiktokLogs] = useState<Tiktok[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [hostFilter, setHostFilter] = useState('');
    const [noLiveFilter, setNoLiveFilter] = useState<string>(''); 

    // Debounced filter
    const [debouncedHost, setDebouncedHost] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Tiktok | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
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
            <h1 className="font-bold mb-5 text-2xl">TikTok Live Logs</h1>

            {/* Filters Section */}
            {/* Changed to flex-col on mobile, flex-row on desktop */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                
                {/* Tabs and Search */}
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    
                    {/* Tabs */}
                    <div>
                        <Tabs value={noLiveFilter} onValueChange={setNoLiveFilter}>
                            <TabsList className='bg-[#e5b85c] text-[#161111] w-full md:w-auto flex-wrap h-auto'>
                                <span className="flex flex-row gap-1 text-xs font-bold text-center mx-2 items-center py-1">
                                    Filters <Filter className="size-3"/>  
                                </span>
                                <TabsTrigger value="false" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">
                                    Days with LIVE
                                </TabsTrigger>
                                <TabsTrigger value="true" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">
                                    Days without LIVE
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput 
                                placeholder="Search host..." 
                                value={hostFilter}
                                onChange={(e) => setHostFilter(e.target.value)}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </section>

                {/* New Button */}
                <section className="w-full md:w-auto">
                    <Button onClick={handleOpenAdd} className='w-full md:w-24 bg-[#e5b85c] text-[#161111] cursor-pointer hover:bg-[#e5b85c]/60'>
                        <span className="flex flex-row items-center justify-center gap-1">
                            <Plus size={16} />
                            New Log
                        </span>
                    </Button>
                </section>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Table Container */}
            <main className="mt-5 p-1 rounded-sm
                border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md 
                shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)]
                h-[calc(100vh-250px)] overflow-y-auto overflow-x-auto">
                
                {/* Raw HTML table forces sticky headers and horizontal scrolling on mobile */}
                <table className="w-full caption-bottom text-sm border-collapse min-w-[600px]">
                    <TableHeader>
                        <TableRow className=" bg-[#efe6dd] hover:bg-[#efe6dd] z-20 ">
                            <TableHead className="font-bold text-[#161111]">Live Date</TableHead>
                            <TableHead className="font-bold text-[#161111]">Hosts</TableHead>
                            <TableHead className="font-bold text-[#161111]">No. of Applicants</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tiktokLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="max-w-[150px] truncate">{log.live_date}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{log.hosts}</TableCell>
                                <TableCell>{log.no_applicants}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(log)}>
                                            Edit
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>

            </main>

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