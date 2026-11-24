import { useEffect, useState } from "react";
import type { Account } from "../types";
import { getAccounts, createAccount, updateAccount } from "../services/accountService";
import AccountModal from "../components/AccountModal";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Plus, Copy, Filter } from "lucide-react";

function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Account | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAccounts(categoryFilter);
            setAccounts(data);
            setError(''); 
        } catch (err) { setError('Failed to fetch accounts.'); } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, [categoryFilter]); 

    const handleOpenAdd = () => { setEditingId(null); setEditingData(null); setIsModalOpen(true); };
    const handleOpenEdit = (acc: Account) => { setEditingId(acc.id); setEditingData(acc); setIsModalOpen(true); };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) await updateAccount(editingId, payload);
            else await createAccount(payload);
            setIsModalOpen(false);
            loadData(); 
        } catch (err) { alert("Action failed."); }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading && accounts.length === 0) return <p>Loading Accounts...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Accounts</h1>

            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div>
                        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
                            <TabsList className='bg-[#e5b85c] text-[#161111] w-full md:w-auto flex-wrap h-auto'>
                                <span className="flex flex-row gap-1 text-xs font-bold text-center mx-2 items-center py-1">
                                    Filters <Filter className="size-3"/>  
                                </span>
                                <TabsTrigger value="" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">All</TabsTrigger>
                                <TabsTrigger value="General" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">General</TabsTrigger>
                                <TabsTrigger value="Network" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Network</TabsTrigger>
                                <TabsTrigger value="Accounting" className="data-active:bg-[#161111] data-active:hover:text-[#e5b85c] data-active:text-[#e5b85c] text-xs bg-[#e5b85c] text-[#161111] cursor-pointer">Accounting</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </section>

                <section className="w-full md:w-auto">
                    <Button onClick={handleOpenAdd} className='w-full md:w-24 bg-[#e5b85c] text-[#161111] cursor-pointer hover:bg-[#e5b85c]/60'>
                        <span className="flex flex-row items-center justify-center gap-1"><Plus size={16} /> New</span>
                    </Button>
                </section>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <main className="mt-5 p-1 rounded-sm border border-white/60 bg-[#efe6dd]/30 backdrop-blur-md shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)] h-[calc(100vh-250px)] overflow-y-auto overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-collapse min-w-[600px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold text-[#161111]">Account</TableHead>
                            <TableHead className="font-bold text-[#161111]">Username / Email</TableHead>
                            <TableHead className="font-bold text-[#161111]">Password</TableHead>
                            <TableHead className="font-bold text-[#161111]">Category</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map((acc) => (
                            <TableRow key={acc.id}>
                                <TableCell className="max-w-[200px] truncate font-medium">{acc.account}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{acc.username_email}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {acc.password}
                                        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer text-gray-500 hover:text-black" onClick={() => handleCopy(acc.password)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{acc.category}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(acc)}>Edit</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

            <AccountModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default AccountsPage;