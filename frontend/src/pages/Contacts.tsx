import { useEffect, useState } from "react";
import type { Contact } from "../types";
import { getContacts, createContact, updateContact } from "../services/contactsService";
import ContactModal from "../components/ContactModal";

function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [nameFilter, setNameFilter] = useState('');
    const [purposeFilter, setPurposeFilter] = useState('');
    
    // Debounced filters
    const [debouncedName, setDebouncedName] = useState('');
    const [debouncedPurpose, setDebouncedPurpose] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Contact | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getContacts(debouncedName, debouncedPurpose);
            setContacts(data);
            setError(''); 
        } catch (err) {
            setError('Failed to fetch contacts.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedName(nameFilter);
            setDebouncedPurpose(purposeFilter);
        }, 500);
        return () => clearTimeout(timer);
    }, [nameFilter, purposeFilter]);

    // Fetch Effect
    useEffect(() => {
        loadData();
    }, [debouncedName, debouncedPurpose]); 

    // --- Handlers ---
    const handleOpenAdd = () => {
        setEditingId(null);
        setEditingData(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (contact: Contact) => {
        setEditingId(contact.id);
        setEditingData(contact);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (payload: any) => {
        try {
            if (editingId) {
                await updateContact(editingId, payload);
            } else {
                await createContact(payload);
            }
            setIsModalOpen(false);
            loadData(); 
        } catch (err) {
            alert("Action failed.");
        }
    };

    // Optional: Handle click to call/copy number
    const handleCall = (number: string) => {
        navigator.clipboard.writeText(number);
        alert(`Copied ${number} to clipboard!`);
    };

    if (loading && contacts.length === 0) return <p>Loading Contacts...</p>;

    return (
        <div>
            <h1>Contact Directory</h1>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <label>Search Name: </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Mr. Contact"
                        value={nameFilter} 
                        onChange={(e) => setNameFilter(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Search Purpose: </label>
                    <input 
                        type="text" 
                        placeholder="e.g. Printer"
                        value={purposeFilter} 
                        onChange={(e) => setPurposeFilter(e.target.value)} 
                    />
                </div>
            </div>

            <button onClick={handleOpenAdd}>New Contact</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Contact Name</th>
                        <th>Contact Number</th>
                        <th>Purpose</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((c) => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.contact_name}</td>
                            <td>
                                {c.contact_number}
                                {/* Added a quick copy button for phone numbers */}
                                <button onClick={() => handleCall(c.contact_number)} style={{ marginLeft: '10px', fontSize: '10px' }}>Copy</button>
                            </td>
                            <td>{c.purpose}</td>
                            <td>
                                <button onClick={() => handleOpenEdit(c)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingData}
            />
        </div>
    );
}

export default ContactsPage;