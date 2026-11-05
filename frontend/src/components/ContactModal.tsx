import { useState, useEffect } from 'react';
import type { Contact } from '../types';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Contact | null; 
}

export default function ContactModal({ isOpen, onClose, onSubmit, initialData }: ContactModalProps) {
    const [formName, setFormName] = useState('');
    const [formNumber, setFormNumber] = useState('');
    const [formPurpose, setFormPurpose] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormName(initialData.contact_name);
                setFormNumber(initialData.contact_number);
                setFormPurpose(initialData.purpose);
            } else {
                setFormName(''); setFormNumber(''); setFormPurpose('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            contact_name: formName,
            contact_number: formNumber,
            purpose: formPurpose,
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h3>{initialData ? 'Edit Contact' : 'Add Contact'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Contact Name:</label>
                    <input type="text" placeholder="e.g. Mr. Contact" value={formName} onChange={(e) => setFormName(e.target.value)} required />

                    <label>Contact Number:</label>
                    <input type="text" placeholder="e.g. 09123456789" value={formNumber} onChange={(e) => setFormNumber(e.target.value)} required />

                    <label>Purpose:</label>
                    <input type="text" placeholder="e.g. Epson Printer" value={formPurpose} onChange={(e) => setFormPurpose(e.target.value)} required />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}