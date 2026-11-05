import { useState, useEffect } from 'react';
import type { Account } from '../types';

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Account | null; 
}

export default function AccountModal({ isOpen, onClose, onSubmit, initialData }: AccountModalProps) {
    const [formAccount, setFormAccount] = useState('');
    const [formUsername, setFormUsername] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formCategory, setFormCategory] = useState('General');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormAccount(initialData.account);
                setFormUsername(initialData.username_email);
                setFormPassword(initialData.password);
                setFormCategory(initialData.category);
            } else {
                setFormAccount(''); setFormUsername(''); setFormPassword(''); setFormCategory('General');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            account: formAccount,
            username_email: formUsername,
            password: formPassword,
            category: formCategory,
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h3>{initialData ? 'Edit Account' : 'Add Account'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label>Account Name:</label>
                    <input type="text" placeholder="e.g. Facebook Page" value={formAccount} onChange={(e) => setFormAccount(e.target.value)} required />

                    <label>Username / Email:</label>
                    <input type="text" placeholder="e.g. admin@test.com" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} required />

                    <label>Password:</label>
                    <input type="text" placeholder="e.g. password123" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required />

                    <label>Category:</label>
                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                        <option value="General">General</option>
                        <option value="Network">Network</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Recruitment">Recruitment</option>
                        <option value="CCTV">CCTV</option>
                        <option value="Anydesk">Anydesk</option>
                    </select>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}