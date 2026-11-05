import { useState, useEffect } from 'react';

interface TiktokModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: any | null; 
}

export default function TiktokModal({ isOpen, onClose, onSubmit, initialData }: TiktokModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formHosts, setFormHosts] = useState('');
    const [formApplicants, setFormApplicants] = useState<number | string>(0);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.live_date || '');
                setFormHosts(initialData.hosts || '');
                setFormApplicants(initialData.no_applicants || 0);
            } else {
                // Clear form for Add mode
                setFormDate(''); 
                setFormHosts(''); 
                setFormApplicants(0); 
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: any = {
            live_date: formDate,
            hosts: formHosts,
            // Ensure it's sent as a number
            no_applicants: Number(formApplicants), 
        };
        
        onSubmit(payload);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>{initialData ? 'Edit TikTok Live' : 'Add TikTok Live'}</h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Date of Live:</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />

                    <label>Hosts:</label>
                    <input type="text" placeholder="e.g. Ms. Cheska, Ms. Hazel" value={formHosts} onChange={(e) => setFormHosts(e.target.value)} required />

                    <label>Number of Applicants:</label>
                    <input 
                        type="number" 
                        min="0"
                        value={formApplicants} 
                        onChange={(e) => setFormApplicants(e.target.value)} 
                        required 
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}