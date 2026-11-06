import { useEffect, useState } from "react";
import type { Purchase } from "../types";
import { getPurchases, createPurchase, updatePurchase } from "../services/purchaseService";
import PurchaseModal from "../components/PurchaseModal";

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

import { Filter, Plus, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";

function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [itemFilter, setItemFilter] = useState('');
    const [beneficiaryFilter, setBeneficiaryFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');

    // Debounced filters
    const [debouncedItem, setDebouncedItem] = useState('');
    const [debouncedBeneficiary, setDebouncedBeneficiary] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Purchase | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getPurchases(debouncedItem, debouncedBeneficiary, sourceFilter);
            setPurchases(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch purchases.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedItem(itemFilter);
            setDebouncedBeneficiary(beneficiaryFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [itemFilter, beneficiaryFilter]);

    // Fetch Effect
    useEffect(() => {
        loadData();
    }, [debouncedItem, debouncedBeneficiary, sourceFilter]);

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (purchase: Purchase) => {
        setEditingId(purchase.id);
        setEditingData(purchase);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updatePurchase(editingId, payload);
            } else {
                await createPurchase(payload);
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            alert("Action failed. Check the form data.");
        }
    };

    if (loading && purchases.length === 0) return <p>Loading Purchases...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Purchase History</h1>

            <div className="flex flex-row justify-between">

                <section className="flex flex-row gap-1">



                    <div>

                        <Tabs value={sourceFilter} onValueChange={setSourceFilter} className="">
                            <TabsList className='bg-[#e5b85c] text-[#161111]'>
                                <span className="flex flex-row gap-1 text-xs font-bold text-center mx-2 items-center">
                                    Filters
                                    <Filter className="size-3" />
                                </span>
                                {/* <TabsTrigger value="false" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer" disabled>Filters:</TabsTrigger> */}
                                <TabsTrigger value="Shopee" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Days with LIVE</TabsTrigger>
                                <TabsTrigger value="TikTok Shop" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Days without LIVE</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div>
                        <InputGroup>
                            <InputGroupInput placeholder="Search..."
                                value={beneficiaryFilter}
                                onChange={(e) => setBeneficiaryFilter(e.target.value)} />
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
                            <TableHead>Date</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Beneficiary</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map(purchase => (
                            <TableRow key={purchase.id}>
                                <TableCell>{purchase.purchase_date}</TableCell>
                                <TableCell className="max-w-50 truncate">{purchase.source}</TableCell>
                                <TableCell>{purchase.item}</TableCell>
                                <TableCell>{purchase.price}</TableCell>
                                <TableCell>{purchase.beneficiary}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(purchase)}>
                                            Edit
                                        </Button>
                                        
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </main>

            <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default PurchasesPage;