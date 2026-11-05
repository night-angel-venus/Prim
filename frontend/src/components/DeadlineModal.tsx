import { useState, useEffect } from 'react';
import type { Deadline } from '../types';

interface DeadlineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Deadline | null; 
}

export default function DeadlineModal({ isOpen, onClose, onSubmit, initialData }: DeadlineModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formBeneficiary, setFormBeneficiary] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.due_date);
                setFormTitle(initialData.title);
                setFormBeneficiary(initialData.beneficiary);
            } else {
                setFormDate(''); setFormTitle(''); setFormBeneficiary('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            due_date: formDate,
            title: formTitle,
            beneficiary: formBeneficiary,
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h3>{initialData ? 'Edit Deadline' : 'Add Deadline'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Due Date:</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />

                    <label>Title:</label>
                    <input type="text" placeholder="e.g. Linux Hosting Renewal" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />

                    <label>Beneficiary:</label>
                    <input type="text" placeholder="e.g. IT Department" value={formBeneficiary} onChange={(e) => setFormBeneficiary(e.target.value)} required />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}