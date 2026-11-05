import { useState, useEffect } from 'react';
import type { Phrase } from '../types';

interface PhraseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Phrase | null; 
}

export default function PhrasebankModal({ isOpen, onClose, onSubmit, initialData }: PhraseModalProps) {
    const [formTitle, setFormTitle] = useState('');
    const [formPhrase, setFormPhrase] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormTitle(initialData.phrase_title);
                setFormPhrase(initialData.phrase);
            } else {
                setFormTitle(''); setFormPhrase('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            phrase_title: formTitle,
            phrase: formPhrase,
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h3>{initialData ? 'Edit Phrase' : 'Add Phrase'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Title:</label>
                    <input type="text" placeholder="e.g. Send Resume" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />

                    <label>Phrase:</label>
                    <textarea 
                        rows={4}
                        placeholder="e.g. Send your resume here..." 
                        value={formPhrase} 
                        onChange={(e) => setFormPhrase(e.target.value)} 
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