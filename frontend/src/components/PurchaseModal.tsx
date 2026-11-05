import { useState, useEffect } from 'react';
import type { Purchase } from '../types';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Purchase | null; 
}

export default function PurchaseModal({ isOpen, onClose, onSubmit, initialData }: PurchaseModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formSource, setFormSource] = useState('Shopee');
    const [formItem, setFormItem] = useState('');
    const [formPrice, setFormPrice] = useState<number | string>(0);
    const [formBeneficiary, setFormBeneficiary] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.purchase_date);
                setFormSource(initialData.source);
                setFormItem(initialData.item);
                setFormPrice(initialData.price);
                setFormBeneficiary(initialData.beneficiary);
            } else {
                setFormDate(''); setFormSource('Shopee'); setFormItem(''); setFormPrice(0); setFormBeneficiary('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            purchase_date: formDate,
            source: formSource,
            item: formItem,
            price: Number(formPrice),
            beneficiary: formBeneficiary,
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h3>{initialData ? 'Edit Purchase' : 'Add Purchase'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Date:</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />

                    <label>Source:</label>
                    <select value={formSource} onChange={(e) => setFormSource(e.target.value)}>
                        <option value="Shopee">Shopee</option>
                        <option value="TikTok Shop">TikTok Shop</option>
                    </select>

                    <label>Item:</label>
                    <input type="text" placeholder="e.g. Epson 003 Ink" value={formItem} onChange={(e) => setFormItem(e.target.value)} required />

                    <label>Price:</label>
                    <input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} required />

                    <label>Beneficiary:</label>
                    <input type="text" placeholder="e.g. Accounting Printer" value={formBeneficiary} onChange={(e) => setFormBeneficiary(e.target.value)} required />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}