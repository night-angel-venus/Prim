import { useEffect, useState } from "react";
import type { Tiktok } from "../types";
import { getTiktok, createTiktok, updateTiktok } from "../services/tiktokService";
import TiktokModal from "../components/TiktokModal";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import { Button } from "../components/ui/button";

import { Plus, SearchIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Filter } from "lucide-react";


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
            <h1 className="font-bold mb-5 text-2xl">TikTok Live Logs</h1>

            {/* Filters */}
            <div className="flex flex-row justify-between">

                <section className="flex flex-row gap-1">

                <div>

                    <Tabs value={noLiveFilter} onValueChange={setNoLiveFilter} className="">
                            <TabsList className='bg-[#e5b85c] text-[#161111]'>
                                <span className="flex flex-row gap-1 text-xs font-bold text-center mx-2 items-center">
                                Filters
                                <Filter className="size-3"/>  
                                </span>
                                {/* <TabsTrigger value="false" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer" disabled>Filters:</TabsTrigger> */}
                                <TabsTrigger value="false" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Days with LIVE</TabsTrigger>
                                <TabsTrigger value="true" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Days without LIVE</TabsTrigger>
                            </TabsList>
                        </Tabs>
                </div>
                <div>
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." 
                        value={hostFilter}
                        onChange={(e) => setHostFilter(e.target.value)}/>
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
            {error && <p style={{ color: 'red' }}>{error}</p>}


            <main className="mt-5 p-1 rounded-sm
    border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md 
    shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)]
    h-[calc(100vh-200px)] overflow-y-auto overflow-x-auto
    ">
        <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Live Date</TableHead>
                            <TableHead>Hosts</TableHead>
                            <TableHead>No. of Applicants</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tiktokLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell className="max-w-50 truncate">{log.live_date}</TableCell>
                                <TableCell>{log.hosts}</TableCell>
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
                </Table>

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