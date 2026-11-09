import { useState, useEffect } from 'react';
import type { Account } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { FieldGroup, FieldSet, Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

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
                setFormAccount(''); 
                setFormUsername(''); 
                setFormPassword(''); 
                setFormCategory('General');
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

    const categories = ["General", "Network", "Accounting", "Recruitment", "CCTV", "Anydesk"];

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-xl font-bold">
                    {initialData ? 'Edit Account' : 'Add New Account'}
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>

                                <Field>
                                    <FieldLabel>Category</FieldLabel>
                                    <Select value={formCategory} onValueChange={(value) => setFormCategory(value || 'General')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* ACCOUNT NAME */}
                                <Field>
                                    <FieldLabel htmlFor="account">Account Name</FieldLabel>
                                    <Input 
                                        id="account" 
                                        autoComplete="off" 
                                        placeholder="e.g. Facebook Page"
                                        value={formAccount} 
                                        onChange={(e) => setFormAccount(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* USERNAME / EMAIL */}
                                <Field>
                                    <FieldLabel htmlFor="username">Username / Email</FieldLabel>
                                    <Input 
                                        id="username" 
                                        autoComplete="off" 
                                        placeholder="e.g. admin@test.com"
                                        value={formUsername} 
                                        onChange={(e) => setFormUsername(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* PASSWORD */}
                                <Field>
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Input 
                                        id="password" 
                                        autoComplete="off" 
                                        placeholder="e.g. password123"
                                        value={formPassword} 
                                        onChange={(e) => setFormPassword(e.target.value)} 
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