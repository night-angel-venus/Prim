import { useState, useEffect } from 'react';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "../components/ui/field";
import { Input } from './ui/input';
import { Textarea } from './ui/textarea'; // <--- Added Textarea
import {
    Card,
    CardContent,
    CardHeader,
} from "../components/ui/card";
import { Button } from './ui/button';

interface PhraseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: any | null;
}

export default function PhraseModal({ isOpen, onClose, onSubmit, initialData }: PhraseModalProps) {
    const [formTitle, setFormTitle] = useState('');
    const [formPhrase, setFormPhrase] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormTitle(initialData.phrase_title);
                setFormPhrase(initialData.phrase);
            } else {
                setFormTitle(''); 
                setFormPhrase('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            phrase_title: formTitle,
            phrase: formPhrase,
        };

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader className="text-xl font-bold">
                    {initialData ? 'Edit Phrase' : 'Add New Phrase'}
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldGroup className='flex flex-col gap-4'>

                                <Field>
                                    <FieldLabel htmlFor="title">Title</FieldLabel>
                                    <Input 
                                        id="title" 
                                        autoComplete="off" 
                                        placeholder="e.g. Send Resume"
                                        value={formTitle} 
                                        onChange={(e) => setFormTitle(e.target.value)} 
                                        required 
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="phrase">Phrase</FieldLabel>
                                    <Textarea 
                                        id="phrase" 
                                        placeholder="e.g. Please send your resume to..." 
                                        className="min-h-[150px] resize-y"
                                        value={formPhrase} 
                                        onChange={(e) => setFormPhrase(e.target.value)} 
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