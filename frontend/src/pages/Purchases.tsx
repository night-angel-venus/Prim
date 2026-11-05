import { useEffect, useState } from "react";
import type { Purchase } from "../types";
import { getPurchases, createPurchase, updatePurchase } from "../services/purchaseService";
import PurchaseModal from "../components/PurchaseModal";


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
            <h1>Purchase History</h1>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Search Item: </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Ink"
                        value={itemFilter} 
                        onChange={(e) => setItemFilter(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Search Beneficiary: </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Printer"
                        value={beneficiaryFilter} 
                        onChange={(e) => setBeneficiaryFilter(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Filter Source: </label>
                    <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                        <option value="">All Sources</option>
                        <option value="Shopee">Shopee</option>
                        <option value="TikTok Shop">TikTok Shop</option>
                    </select>
                </div>
            </div>

            <button onClick={handleOpenAdd}>New Purchase</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Source</th>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Beneficiary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.purchase_date}</td>
                            <td>{p.source}</td>
                            <td>{p.item}</td>
                            <td>{p.price}</td>
                            <td>{p.beneficiary}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(p)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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