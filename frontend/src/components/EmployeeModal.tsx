import { useState, useEffect } from 'react';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "../components/ui/field";
import { Input } from './ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"; // <--- Using Select instead of Combobox

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import { Button } from './ui/button';

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: any | null;
}

export default function EmployeeModal({ isOpen, onClose, onSubmit, initialData }: EmployeeModalProps) {
    const [formName, setFormName] = useState('');
    const [formDepartment, setFormDepartment] = useState('IT');
    const [formEmail, setFormEmail] = useState('');
    const [formContact, setFormContact] = useState('');
    const [formPassword, setFormPassword] = useState('');

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

    const departments = ["IT", "Operations", "Admin/HR", "Recruitment", "Accounting"];

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <Card className="bg-white p-6 rounded-lg w-100 max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-xl font-bold mb-4">{initialData ? 'Edit Employee' : 'Add New Employee'}</CardHeader>

                <CardContent>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col'>

                                <Field>
                                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                    <Input id="name" autoComplete="off" placeholder="Employee Name"
                                        value={formName} onChange={(e) => setFormName(e.target.value)} required
                                    />
                                </Field>





                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input id="email" autoComplete="off" type="email" placeholder="Email"
                                        value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required
                                    />
                                </Field>

                                <div className='grid grid-cols-2 gap-2'>

                                    <Field>
                                        <FieldLabel htmlFor="contact">Contact No.</FieldLabel>
                                        <Input id="contact" autoComplete="off" placeholder="Contact Number"
                                            value={formContact} onChange={(e) => setFormContact(e.target.value)} required
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel>Department</FieldLabel>
                                        <Select value={formDepartment} onValueChange={(value) => setFormDepartment(value || '')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input id="password" autoComplete="new-password" type="password"
                                        placeholder={initialData ? "New Password (leave blank to keep)" : "Password"}
                                        value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required={!initialData}
                                    />
                                </Field>

                            </FieldGroup>
                        </FieldSet>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" type="button" onClick={onClose} className="h-7 px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer">Cancel</Button>
                            <Button variant="default" type="submit" className="h-7 px-4 py-2 bg-[#9a0002] text-white rounded hover:bg-[#9a0002]/60 cursor-pointer">Save</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}