import { useState, useEffect } from 'react';
import { CardContent, CardHeader } from './ui/card';
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

interface TiktokModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: any | null;
}

export default function TiktokModal({ isOpen, onClose, onSubmit, initialData }: TiktokModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formHosts, setFormHosts] = useState('');
    const [formApplicants, setFormApplicants] = useState<number | string>(0);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.live_date || '');
                setFormHosts(initialData.hosts || '');
                setFormApplicants(initialData.no_applicants || 0);
            } else {
                setFormDate('');
                setFormHosts('');
                setFormApplicants(0);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: any = {
            live_date: formDate, // This is now correctly formatted as YYYY-MM-DD
            hosts: formHosts,
            no_applicants: Number(formApplicants),
        };

        onSubmit(payload);
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4'>
            <div className='bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
                <CardHeader className="text-xl font-bold mb-4 p-0">
                    {initialData ? 'Edit TikTok Live' : 'Add New TikTok Live'}
                </CardHeader>

                <CardContent className="p-0">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>
                                
                                {/* DATE PICKER */}
                                <Field className="flex flex-col">
                                    <FieldLabel>Date</FieldLabel>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button variant="outline" className="justify-start font-normal text-left">
                                                {/* Convert string to Date object for display, or show placeholder */}
                                                {formDate ? format(new Date(formDate), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                // Convert string to Date object for the calendar's selected state
                                                selected={formDate ? new Date(formDate) : undefined}
                                                // Convert the selected Date back to a YYYY-MM-DD string
                                                onSelect={(selectedDate) => {
                                                    if (selectedDate) {
                                                        setFormDate(format(selectedDate, "yyyy-MM-dd"));
                                                    }
                                                }}
                                                // Set the initial month to the selected date, or today
                                                defaultMonth={formDate ? new Date(formDate) : new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </Field>

                                {/* HOSTS */}
                                <Field>
                                    <FieldLabel htmlFor="hosts">Hosts</FieldLabel>
                                    <Input 
                                        id="hosts" 
                                        autoComplete="off" 
                                        placeholder="e.g. Ms. Hazel, Ms. Cheska"
                                        value={formHosts} 
                                        onChange={(e) => setFormHosts(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* APPLICANTS */}
                                <Field>
                                    <FieldLabel htmlFor="applicants">No. of Applicants</FieldLabel>
                                    <Input 
                                        id="applicants" 
                                        type="number"
                                        min="0"
                                        autoComplete="off" 
                                        placeholder="0"
                                        value={formApplicants} 
                                        onChange={(e) => setFormApplicants(e.target.value)} 
                                        required 
                                    />
                                </Field>
                            </FieldGroup>

                            {/* BUTTONS */}
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" type="button" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-[#9a0002] text-white hover:bg-[#9a0002]/80">
                                    Save
                                </Button>
                            </div>
                        </FieldSet>
                    </form>
                </CardContent>
            </div>
        </div>
    );
}