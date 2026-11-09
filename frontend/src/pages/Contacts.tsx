import { useEffect, useState } from "react";
import type { Contact } from "../types";
import ContactModal from "../components/ContactModal";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../components/ui/input-group";
import { Plus, SearchIcon, Copy } from "lucide-react";
import { createContact, getContacts, updateContact } from "../services/contactsService";

function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [nameFilter, setNameFilter] = useState('');
    const [purposeFilter, setPurposeFilter] = useState('');
    
    const [debouncedName, setDebouncedName] = useState('');
    const [debouncedPurpose, setDebouncedPurpose] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Contact | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getContacts(debouncedName, debouncedPurpose);
            setContacts(data);
            setError(''); 
        } catch (err) { setError('Failed to fetch contacts.'); } finally { setLoading(false); }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(nameFilter);
            setDebouncedPurpose(purposeFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [nameFilter, purposeFilter]);

    useEffect(() => { loadData(); }, [debouncedName, debouncedPurpose]); 

    const handleOpenAdd = () => { setEditingId(null); setEditingData(null); setIsModalOpen(true); };
    const handleOpenEdit = (contact: Contact) => { setEditingId(contact.id); setEditingData(contact); setIsModalOpen(true); };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) await updateContact(editingId, payload);
            else await createContact(payload);
            setIsModalOpen(false);
            loadData(); 
        } catch (err) { alert("Action failed."); }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    if (loading && contacts.length === 0) return <p>Loading Contacts...</p>;

    return (
        <div>
            <h1 className="font-bold mb-5 text-2xl">Contacts</h1>

            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <section className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search name..." value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className="w-full md:w-auto">
                        <InputGroup>
                            <InputGroupInput placeholder="Search purpose..." value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)} />
                            <InputGroupAddon><SearchIcon /></InputGroupAddon>
                        </InputGroup>
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
                            <TableHead className="font-bold text-[#161111]">Contact Name</TableHead>
                            <TableHead className="font-bold text-[#161111]">Contact Number</TableHead>
                            <TableHead className="font-bold text-[#161111]">Purpose</TableHead>
                            <TableHead className="font-bold text-[#161111]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell className="max-w-[200px] truncate font-medium">{c.contact_name}</TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    <div className="flex items-center gap-2">
                                        {c.contact_number}
                                        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer text-gray-500 hover:text-black" onClick={() => handleCopy(c.contact_number)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{c.purpose}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="h-6 text-xs rounded-xs cursor-pointer" onClick={() => handleOpenEdit(c)}>Edit</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </table>
            </main>

            <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={editingData} />
        </div>
    );
}
export default ContactsPage;