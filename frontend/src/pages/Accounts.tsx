import { useEffect, useState } from "react";
import type { Account } from "../types";
import { getAccounts, createAccount, updateAccount } from "../services/accountService";
import AccountModal from "../components/AccountModal";

function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filter
    const [categoryFilter, setCategoryFilter] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Account | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAccounts(categoryFilter);
            setAccounts(data);
            setError(''); 
        } catch (err) {
            setError('Failed to fetch accounts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [categoryFilter]); 

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (acc: Account) => {
        setEditingId(acc.id);
        setEditingData(acc);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updateAccount(editingId, payload);
            } else {
                await createAccount(payload);
            }
            setIsModalOpen(false);
            loadData(); 
        } catch (err) {
            alert("Action failed.");
        }
    };

    // Helper to copy password to clipboard
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading && accounts.length === 0) return <p>Loading Accounts...</p>;

    return (
        <div>
            <h1>Admin Accounts</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <label>Filter by Category: </label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="General">General</option>
                    <option value="Network">Network</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Recruitment">Recruitment</option>
                    <option value="CCTV">CCTV</option>
                    <option value="Anydesk">Anydesk</option>
                </select>
            </div>

            <button onClick={handleOpenAdd}>New Account</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Account</th>
                        <th>Username / Email</th>
                        <th>Password</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((acc) => (
                        <tr key={acc.id}>
                            <td>{acc.id}</td>
                            <td>{acc.account}</td>
                            <td>{acc.username_email}</td>
                            <td>
                                {acc.password}
                                {/* Quick copy button for passwords */}
                                <button onClick={() => handleCopy(acc.password)} style={{ marginLeft: '10px', fontSize: '10px' }}>Copy</button>
                            </td>
                            <td>{acc.category}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(acc)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default AccountsPage;