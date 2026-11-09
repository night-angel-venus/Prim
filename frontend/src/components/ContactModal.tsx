import { useState, useEffect } from 'react';
import type { Contact } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { FieldGroup, FieldSet, Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Contact | null; 
}

export default function ContactModal({ isOpen, onClose, onSubmit, initialData }: ContactModalProps) {
    const [formName, setFormName] = useState('');
    const [formNumber, setFormNumber] = useState('');
    const [formPurpose, setFormPurpose] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormName(initialData.contact_name);
                setFormNumber(initialData.contact_number);
                setFormPurpose(initialData.purpose);
            } else {
                setFormName(''); 
                setFormNumber(''); 
                setFormPurpose('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            contact_name: formName,
            contact_number: formNumber,
            purpose: formPurpose,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-xl font-bold">
                    {initialData ? 'Edit Contact' : 'Add New Contact'}
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>

                                {/* NAME */}
                                <Field>
                                    <FieldLabel htmlFor="name">Contact Name</FieldLabel>
                                    <Input 
                                        id="name" 
                                        autoComplete="off" 
                                        placeholder="e.g. Mr. Contact"
                                        value={formName} 
                                        onChange={(e) => setFormName(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* NUMBER */}
                                <Field>
                                    <FieldLabel htmlFor="number">Contact Number</FieldLabel>
                                    <Input 
                                        id="number" 
                                        autoComplete="off" 
                                        type="tel"
                                        placeholder="e.g. 09123456789"
                                        value={formNumber} 
                                        onChange={(e) => setFormNumber(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* PURPOSE */}
                                <Field>
                                    <FieldLabel htmlFor="purpose">Purpose</FieldLabel>
                                    <Input 
                                        id="purpose" 
                                        autoComplete="off" 
                                        placeholder="e.g. Epson Printer"
                                        value={formPurpose} 
                                        onChange={(e) => setFormPurpose(e.target.value)} 
                                        required 
                                    />
                                </Field>

                            </FieldGroup>
                        </FieldSet>

                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" type="button" onClick={onClose} className="cursor-pointer">
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#9a0002] text-white hover:bg-[#9a0002]/80 cursor-pointer">
                                Save
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}