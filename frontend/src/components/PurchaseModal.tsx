import { useState, useEffect } from 'react';
import type { Purchase } from '../types';

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

import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover";

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Purchase | null;
}

export default function PurchaseModal({ isOpen, onClose, onSubmit, initialData }: PurchaseModalProps) {
    const [formDate, setFormDate] = useState('');
    const [formSource, setFormSource] = useState('Shopee');
    const [formItem, setFormItem] = useState('');
    const [formPrice, setFormPrice] = useState<number | string>(0);
    const [formBeneficiary, setFormBeneficiary] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormDate(initialData.purchase_date);
                setFormSource(initialData.source);
                setFormItem(initialData.item);
                setFormPrice(initialData.price);
                setFormBeneficiary(initialData.beneficiary);
            } else {
                setFormDate(''); setFormSource('Shopee'); setFormItem(''); setFormPrice(0); setFormBeneficiary('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            purchase_date: formDate,
            source: formSource,
            item: formItem,
            price: Number(formPrice),
            beneficiary: formBeneficiary,
        });
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4'>
            <Card className='bg-white w-full max-w-md max-h-[90vh] overflow-y-auto'>
                <CardHeader className="text-xl font-bold">
                    {initialData ? 'Edit Purchase' : 'Add New Purchase'}
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>

                                {/* DATE PICKER */}
                                <Field className="flex flex-col">
                                    <FieldLabel>Date</FieldLabel>
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

                                {/* SOURCE SELECT */}
                                <Field>
                                    <FieldLabel>Source</FieldLabel>
                                    <Select value={formSource} onValueChange={(value) => setFormSource(value || 'Shopee')}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Shopee">Shopee</SelectItem>
                                            <SelectItem value="TikTok Shop">TikTok Shop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                {/* ITEM */}
                                <Field>
                                    <FieldLabel htmlFor="item">Item</FieldLabel>
                                    <Input 
                                        id="item" 
                                        autoComplete="off" 
                                        placeholder="e.g. Epson 003 Ink"
                                        value={formItem} 
                                        onChange={(e) => setFormItem(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* PRICE */}
                                <Field>
                                    <FieldLabel htmlFor="price">Price</FieldLabel>
                                    <Input 
                                        id="price" 
                                        type="number" 
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={formPrice} 
                                        onChange={(e) => setFormPrice(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                {/* BENEFICIARY */}
                                <Field>
                                    <FieldLabel htmlFor="beneficiary">Beneficiary</FieldLabel>
                                    <Input 
                                        id="beneficiary" 
                                        autoComplete="off" 
                                        placeholder="e.g. Accounting Printer"
                                        value={formBeneficiary} 
                                        onChange={(e) => setFormBeneficiary(e.target.value)} 
                                        required 
                                    />
                                </Field>

                            </FieldGroup>
                        </FieldSet>

                        {/* BUTTONS */}
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