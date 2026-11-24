import { useState, useEffect } from 'react';
import type { Fedex } from '../types';
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

interface FedexModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Fedex | null; 
}

export default function FedexModal({ isOpen, onClose, onSubmit, initialData }: FedexModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formReason, setFormReason] = useState('');
    const [formCompanions, setFormCompanions] = useState('');
    const [formDepOffice, setFormDepOffice] = useState('');
    const [formArrFedex, setFormArrFedex] = useState('');
    const [formDepFedex, setFormDepFedex] = useState('');
    const [formArrOffice, setFormArrOffice] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.visit_date || '');
                setFormReason(initialData.visit_reason || '');
                setFormCompanions(initialData.companions || '');
                setFormDepOffice(initialData.departure_office || '');
                setFormArrFedex(initialData.arrival_fedex || '');
                setFormDepFedex(initialData.departure_fedex || '');
                setFormArrOffice(initialData.arrival_office || '');
            } else {
                setFormDate(''); 
                setFormReason(''); 
                setFormCompanions(''); 
                setFormDepOffice(''); 
                setFormArrFedex(''); 
                setFormDepFedex(''); 
                setFormArrOffice('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: any = {
            visit_date: formDate,
            visit_reason: formReason,
            companions: formCompanions,
            departure_office: formDepOffice,
            arrival_fedex: formArrFedex,
            departure_fedex: formDepFedex,
            arrival_office: formArrOffice,
        };
        
        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-xl font-bold">
                    {initialData ? 'Edit FedEx Visit' : 'Add FedEx Visit'}
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>

                                {/* DATE PICKER */}
                                <Field className="flex flex-col">
                                    <FieldLabel>Date of Visit</FieldLabel>
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

                                {/* REASON */}
                                <Field>
                                    <FieldLabel htmlFor="reason">Reason</FieldLabel>
                                    <Input 
                                        id="reason" 
                                        autoComplete="off" 
                                        placeholder="e.g. Orientation, Training"
                                        value={formReason} 
                                        onChange={(e) => setFormReason(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* COMPANIONS */}
                                <Field>
                                    <FieldLabel htmlFor="companions">Companions</FieldLabel>
                                    <Input 
                                        id="companions" 
                                        autoComplete="off" 
                                        placeholder="e.g. John, Jane"
                                        value={formCompanions} 
                                        onChange={(e) => setFormCompanions(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* TIMES */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="depOffice">Departure from Office</FieldLabel>
                                        <Input 
                                            id="depOffice" 
                                            type="time" 
                                            value={formDepOffice} 
                                            onChange={(e) => setFormDepOffice(e.target.value)} 
                                            required 
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="arrFedex">Arrival at FedEx</FieldLabel>
                                        <Input 
                                            id="arrFedex" 
                                            type="time" 
                                            value={formArrFedex} 
                                            onChange={(e) => setFormArrFedex(e.target.value)} 
                                            required 
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="depFedex">Departure from FedEx</FieldLabel>
                                        <Input 
                                            id="depFedex" 
                                            type="time" 
                                            value={formDepFedex} 
                                            onChange={(e) => setFormDepFedex(e.target.value)} 
                                            required 
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="arrOffice">Arrival at Office</FieldLabel>
                                        <Input 
                                            id="arrOffice" 
                                            type="time" 
                                            value={formArrOffice} 
                                            onChange={(e) => setFormArrOffice(e.target.value)} 
                                            required 
                                        />
                                    </Field>
                                </div>

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