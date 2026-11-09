import { useEffect, useState } from "react";
import type { Purchase } from "../types";
import { getPurchases, createPurchase, updatePurchase } from "../services/purchaseService";
import PurchaseModal from "../components/PurchaseModal";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Plus, SearchIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [itemFilter, setItemFilter] = useState('');
    const [beneficiaryFilter, setBeneficiaryFilter] = useState('');
    
    // Changed initial state from '' to 'all' for the Select component
    const [sourceFilter, setSourceFilter] = useState('all');

    const [debouncedItem, setDebouncedItem] = useState('');
    const [debouncedBeneficiary, setDebouncedBeneficiary] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Purchase | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            // If 'all' is selected, send empty string to backend
            const sourceQuery = sourceFilter === 'all' ? '' : sourceFilter;
            const data = await getPurchases(debouncedItem, debouncedBeneficiary, sourceQuery);
            setPurchases(data);
            setError('');
        } catch (err) { setError('Failed to fetch purchases.'); } finally { setLoading(false); }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedItem(itemFilter);
            setDebouncedBeneficiary(beneficiaryFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [itemFilter, beneficiaryFilter]);

    useEffect(() => { loadData(); }, [debouncedItem, debouncedBeneficiary, sourceFilter]);

    const handleOpenAdd = () => { setEditingId(null); setEditingData(null); setIsModalOpen(true); };
    const handleOpenEdit = (purchase: Purchase) => { setEditingId(purchase.id); setEditingData(purchase); setIsModalOpen(true); };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) await updatePurchase(editingId, payload);
            else await createPurchase(payload);
            setIsModalOpen(false);
            loadData();
        } catch (err) { alert("Action failed."); }
    };

    if (loading && purchases.length === 0) return <p>Loading Purchases...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Purchase History</h1>

            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    
                    {/* Item Search */}
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search item..." value={itemFilter} onChange={(e) => setItemFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>

                    {/* Beneficiary Search */}
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search beneficiary..." value={beneficiaryFilter} onChange={(e) => setBeneficiaryFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>

                    {/* Source Filter (Shadcn Select) */}
                    <div className="w-full md:w-auto">
                        <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value || 'all')}>
                            <SelectTrigger className="w-full md:w-[180px] h-10">
                                <SelectValue placeholder="Source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Sources</SelectItem>
                                <SelectItem value="Shopee">Shopee</SelectItem>
                                <SelectItem value="TikTok Shop">TikTok Shop</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <TableRow>
                            <TableHead className="font-bold text-[#161111]">Date</TableHead>
                            <TableHead className="font-bold text-[#161111]">Source</TableHead>
                            <TableHead className="font-bold text-[#161111]">Item</TableHead>
                            <TableHead className="font-bold text-[#161111]">Price</TableHead>
                            <TableHead className="font-bold text-[#161111]">Beneficiary</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="max-w-[120px] truncate">{p.purchase_date}</TableCell>
                                <TableCell>{p.source}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{p.item}</TableCell>
                                <TableCell>₱{p.price}</TableCell>
                                <TableCell>{p.beneficiary}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(p)}>Edit</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

            <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default PurchasesPage;