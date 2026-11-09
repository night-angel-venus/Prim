import { useState, useEffect } from 'react';
import type { Report } from '../types';
import { Card, CardContent, CardHeader } from './ui/card';
import { FieldGroup, FieldSet, Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Report | null; 
}

export default function ReportModal({ isOpen, onClose, onSubmit, initialData }: ReportModalProps) {
    const [formProblem, setFormProblem] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formSolution, setFormSolution] = useState('');
    const [formReportedBy, setFormReportedBy] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormProblem(initialData.problem);
                setFormDescription(initialData.description);
                setFormSolution(initialData.solution);
                setFormReportedBy(initialData.reported_by);
            } else {
                setFormProblem(''); setFormDescription(''); setFormSolution(''); setFormReportedBy('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            problem: formProblem,
            description: formDescription,
            solution: formSolution,
            reported_by: formReportedBy,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-xl font-bold">
                    {initialData ? 'Edit Report' : 'Add New Report'}
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>
                                
                                <Field>
                                    <FieldLabel htmlFor="problem">Problem</FieldLabel>
                                    <Input 
                                        id="problem" 
                                        autoComplete="off" 
                                        placeholder=""
                                        value={formProblem} 
                                        onChange={(e) => setFormProblem(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="description">Description</FieldLabel>
                                    <Textarea 
                                        id="description" 
                                        placeholder="" 
                                        className="min-h-25 resize-y"
                                        value={formDescription} 
                                        onChange={(e) => setFormDescription(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="solution">Solution</FieldLabel>
                                    <Textarea 
                                        id="solution" 
                                        placeholder="" 
                                        className="min-h-25 resize-y"
                                        value={formSolution} 
                                        onChange={(e) => setFormSolution(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="reportedBy">Reported By</FieldLabel>
                                    <Input 
                                        id="reportedBy" 
                                        autoComplete="off" 
                                        placeholder=""
                                        value={formReportedBy} 
                                        onChange={(e) => setFormReportedBy(e.target.value)} 
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