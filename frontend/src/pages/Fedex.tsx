import { useEffect, useState } from "react";
import type { Fedex } from "../types";
import { getFedex, createFedex, updateFedex } from "../services/fedexService";
import FedexModal from "../components/FedexModal";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function FedexPage() {
    const [fedexLogs, setFedexLogs] = useState<Fedex[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [companionFilter, setCompanionFilter] = useState('');
    const [reasonFilter, setReasonFilter] = useState('');

    const [debouncedCompanion, setDebouncedCompanion] = useState('');
    const [debouncedReason, setDebouncedReason] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Fedex | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getFedex(debouncedCompanion, debouncedReason);
            setFedexLogs(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch FedEx logs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCompanion(companionFilter);
            setDebouncedReason(reasonFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [companionFilter, reasonFilter]);

    useEffect(() => {
        loadData();
    }, [debouncedCompanion, debouncedReason]);

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
            if (editingId) await updateFedex(editingId, payload);
            else await createFedex(payload);
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            alert("Action failed. Please check the form data.");
        }
    };

    if (loading && fedexLogs.length === 0) return <p>Loading FedEx Logs...</p>;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden">
            
            <h1 className="font-bold text-2xl shrink-0 mb-4">FedEx Visit History</h1>

            {/* Main layout is a row, no breakpoints to force it side-by-side */}
            <div className="flex flex-row gap-4 flex-1 min-h-0 w-full">
                
                {/* LEFT SIDE: Scrollable Cards */}
                <div className="flex-1 min-w-0 overflow-y-auto pb-4 flex flex-col gap-4 pr-2">
                    {fedexLogs.map((log) => (
                        <div key={log.id} className="grid grid-cols-1 md:grid-cols-[200px_1fr] rounded-sm p-4 gap-4
                            border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md 
                            shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] shrink-0">
                            
                            <section className="flex flex-col gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold">{log.visit_date}</h1>
                                    <h3 className="text-sm font-semibold text-gray-700">{log.visit_reason}</h3>
                                </div>

                                <div>
                                    <h1 className="font-semibold text-sm mb-1">Companions:</h1>
                                    <ul className="text-sm flex flex-col gap-1">
                                        {log.companions.split(',').map((companion, index) => (
                                            <li key={index}>{companion.trim()}</li>
                                        ))}
                                    </ul>
                                </div>

                                <Button 
                                    onClick={() => handleOpenEdit(log)}
                                    className="w-fit h-7 text-xs cursor-pointer bg-[#6A0DAD] hover:bg-[#6A0DAD]/80 text-white mt-auto"
                                >
                                    Edit
                                </Button>
                            </section>

                            <section className="flex flex-col justify-center md:pl-4 border-t md:border-t-0 md:border-l border-gray-300/50 pt-4 md:pt-0">
                                <div className="flex flex-row justify-between md:justify-start gap-6 text-sm">
                                    <div className="flex flex-col gap-3 font-semibold">
                                        <span>Departure from Office</span>
                                        <span>Arrival at FedEx</span>
                                        <span>Departure from FedEx</span>
                                        <span>Arrival at Office</span>
                                    </div>
                                    <div className="flex flex-col gap-3 font-bold text-right md:text-left">
                                        <span>{log.departure_office}</span>
                                        <span>{log.arrival_fedex}</span>
                                        <span>{log.departure_fedex}</span>
                                        <span>{log.arrival_office}</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ))}

                    {fedexLogs.length === 0 && (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No FedEx logs found.
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE: Narrow Sidebar */}
                {/* Reduced width to 220px */}
                <div className="w-[170px] shrink-0 h-full">
                    <div className="bg-[#6A0DAD] text-white p-3 rounded-md h-full flex flex-col shadow-xl border border-white/20">
                        
                        <div className="flex flex-row items-center justify-between gap-2 mb-4 pb-3 border-b border-white/20">
                            <h2 className="text-md font-bold">Filters</h2>
                            <Button 
                                onClick={handleOpenAdd} 
                                className="bg-[#FF6B00] hover:bg-[#FF6B00]/80 text-white font-bold cursor-pointer py-1 px-2 h-7 text-[10px]"
                            >
                                + New
                            </Button>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-semibold">Reason</label>
                                <Input
                                    type="text"
                                    placeholder="e.g. Training"
                                    value={reasonFilter}
                                    onChange={(e) => setReasonFilter(e.target.value)}
                                    className="bg-white/10 text-white border-white/20 placeholder:text-white/50 focus:bg-white focus:text-black transition-colors h-7 text-xs px-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-semibold">Companion</label>
                                <Input
                                    type="text"
                                    placeholder="e.g. John"
                                    value={companionFilter}
                                    onChange={(e) => setCompanionFilter(e.target.value)}
                                    className="bg-white/10 text-white border-white/20 placeholder:text-white/50 focus:bg-white focus:text-black transition-colors h-7 text-xs px-2"
                                />
                            </div>
                        </div>

                    </div>
                </div>

            </div>

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