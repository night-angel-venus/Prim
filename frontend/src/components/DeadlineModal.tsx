import { useState, useEffect } from 'react';
import type { Deadline } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { FieldGroup, FieldSet, Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';

import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover";

interface DeadlineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Deadline | null; 
}

export default function DeadlineModal({ isOpen, onClose, onSubmit, initialData }: DeadlineModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formBeneficiary, setFormBeneficiary] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.due_date);
                setFormTitle(initialData.title);
                setFormBeneficiary(initialData.beneficiary);
            } else {
                setFormDate(''); 
                setFormTitle(''); 
                setFormBeneficiary('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            due_date: formDate,
            title: formTitle,
            beneficiary: formBeneficiary,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-xl font-bold">
                    {initialData ? 'Edit Deadline' : 'Add New Deadline'}
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>

                                {/* DATE PICKER */}
                                <Field className="flex flex-col">
                                    <FieldLabel>Due Date</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button variant="outline" className="justify-start font-normal text-left w-full">
                                                {formDate ? format(new Date(formDate), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formDate ? new Date(formDate) : undefined}
                                                onSelect={(selectedDate) => {
                                                    if (selectedDate) {
                                                        setFormDate(format(selectedDate, "yyyy-MM-dd"));
                                                    }
                                                }}
                                                defaultMonth={formDate ? new Date(formDate) : new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>

                                {/* TITLE */}
                                <Field>
                                    <FieldLabel htmlFor="title">Title</FieldLabel>
                                    <Input 
                                        id="title" 
                                        autoComplete="off" 
                                        placeholder=""
                                        value={formTitle} 
                                        onChange={(e) => setFormTitle(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* BENEFICIARY */}
                                <Field>
                                    <FieldLabel htmlFor="beneficiary">Beneficiary</FieldLabel>
                                    <Input 
                                        id="beneficiary" 
                                        autoComplete="off" 
                                        placeholder=""
                                        value={formBeneficiary} 
                                        onChange={(e) => setFormBeneficiary(e.target.value)} 
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