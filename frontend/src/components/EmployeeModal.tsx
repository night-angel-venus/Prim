import { useState, useEffect } from 'react';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: any | null; // If null, it's Add mode. If object, it's Edit mode.
}

export default function EmployeeModal({ isOpen, onClose, onSubmit, initialData }: EmployeeModalProps) {
    const [formName, setFormName] = useState('');
    const [formDepartment, setFormDepartment] = useState('IT');
    const [formEmail, setFormEmail] = useState('');
    const [formContact, setFormContact] = useState('');
    const [formPassword, setFormPassword] = useState('');

    // When the modal opens, fill the form (or clear it if it's a new employee)
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormName(initialData.employee_name);
                setFormDepartment(initialData.employee_department);
                setFormEmail(initialData.employee_email);
                setFormContact(initialData.contact_no);
                setFormPassword('');
            } else {
                setFormName(''); setFormDepartment('IT'); setFormEmail(''); setFormContact(''); setFormPassword('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = {
            employee_name: formName,
            employee_department: formDepartment,
            employee_email: formEmail,
            contact_no: formContact,
        };
        if (formPassword) payload.employee_password = formPassword;
        
        onSubmit(payload);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h3>{initialData ? 'Edit Employee' : 'Add New Employee'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                    <select value={formDepartment} onChange={(e) => setFormDepartment(e.target.value)}>
                        <option value="IT">IT</option>
                        <option value="Admin/HR">Admin/HR</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Operations">Operations</option>
                        <option value="Recruitment">Recruitment</option>
                    </select>
                    <input type="email" placeholder="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                    <input placeholder="Contact No" value={formContact} onChange={(e) => setFormContact(e.target.value)} required />
                    <input type="password" placeholder={initialData ? "New Password (leave blank to keep)" : "Password"} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required={!initialData} />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}