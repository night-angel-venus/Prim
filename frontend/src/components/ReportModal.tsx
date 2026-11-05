import { useState, useEffect } from 'react';
import type { Report } from '../types';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Report | null; 
}

export default function ReportModal({ isOpen, onClose, onSubmit, initialData }: ReportModalProps) {
    const [formProblem, setFormProblem] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formSolution, setFormSolution] = useState('');
    const [formReportedBy, setFormReportedBy] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormProblem(initialData.problem);
                setFormDescription(initialData.description);
                setFormSolution(initialData.solution);
                setFormReportedBy(initialData.reported_by);
            } else {
                setFormProblem(''); setFormDescription(''); setFormSolution(''); setFormReportedBy('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            problem: formProblem,
            description: formDescription,
            solution: formSolution,
            reported_by: formReportedBy,
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>{initialData ? 'Edit Report' : 'Add Report'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Problem:</label>
                    <input type="text" placeholder="e.g. Printer Offline" value={formProblem} onChange={(e) => setFormProblem(e.target.value)} required />

                    <label>Description:</label>
                    <textarea rows={3} placeholder="Describe the issue..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} required />

                    <label>Solution:</label>
                    <textarea rows={3} placeholder="How was it fixed?" value={formSolution} onChange={(e) => setFormSolution(e.target.value)} required />

                    <label>Reported By:</label>
                    <input type="text" placeholder="e.g. Sir Andre" value={formReportedBy} onChange={(e) => setFormReportedBy(e.target.value)} required />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}