import { useState, useEffect } from 'react';

interface FedexModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: any | null; // If null, it's Add mode. If object, it's Edit mode.
}

export default function FedexModal({ isOpen, onClose, onSubmit, initialData }: FedexModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formReason, setFormReason] = useState('');
    const [formCompanions, setFormCompanions] = useState('');
    const [formDepOffice, setFormDepOffice] = useState('');
    const [formArrFedex, setFormArrFedex] = useState('');
    const [formDepFedex, setFormDepFedex] = useState('');
    const [formArrOffice, setFormArrOffice] = useState('');

    // When the modal opens, fill the form (or clear it if it's a new record)
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.visit_date || '');
                setFormReason(initialData.visit_reason || '');
                setFormCompanions(initialData.companions || '');
                setFormDepOffice(initialData.departure_office || '');
                setFormArrFedex(initialData.arrival_fedex || '');
                setFormDepFedex(initialData.departure_fedex || '');
                setFormArrOffice(initialData.arrival_office || '');
            } else {
                // Clear form for Add mode
                setFormDate(''); 
                setFormReason(''); 
                setFormCompanions(''); 
                setFormDepOffice(''); 
                setFormArrFedex(''); 
                setFormDepFedex(''); 
                setFormArrOffice('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Build the payload matching FedexCreate schema
        const payload: any = {
            visit_date: formDate,
            visit_reason: formReason,
            companions: formCompanions,
            departure_office: formDepOffice,
            arrival_fedex: formArrFedex,
            departure_fedex: formDepFedex,
            arrival_office: formArrOffice,
        };
        
        onSubmit(payload);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>{initialData ? 'Edit FedEx Visit' : 'Add FedEx Visit'}</h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Date of Visit:</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />

                    <label>Reason:</label>
                    <input type="text" placeholder="e.g. Orientation, Training" value={formReason} onChange={(e) => setFormReason(e.target.value)} required />

                    <label>Companions:</label>
                    <input type="text" placeholder="e.g. John, Jane" value={formCompanions} onChange={(e) => setFormCompanions(e.target.value)} required />

                    <label>Departure Time from Office:</label>
                    <input type="time" value={formDepOffice} onChange={(e) => setFormDepOffice(e.target.value)} required />

                    <label>Arrival Time at CRK:</label>
                    <input type="time" value={formArrFedex} onChange={(e) => setFormArrFedex(e.target.value)} required />

                    <label>Departure Time from CRK:</label>
                    <input type="time" value={formDepFedex} onChange={(e) => setFormDepFedex(e.target.value)} required />

                    <label>Arrival Time at Office:</label>
                    <input type="time" value={formArrOffice} onChange={(e) => setFormArrOffice(e.target.value)} required />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}