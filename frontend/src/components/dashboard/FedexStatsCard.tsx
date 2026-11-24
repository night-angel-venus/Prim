import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../api';

export default function PrinterStatsCard() {
    const [printers, setPrinters] = useState<any[]>([]);

    useEffect(() => {
        // Fetch data from the local backend
        api.get('/printer/ink')
            .then(res => setPrinters(res.data))
            .catch(err => console.error(err));
    }, []);



    return (
        <div className="flex flex-col gap-2 w-full h-full">
            {printers.map((printer) => (
                <div key={printer.id} className="bg-[#efe6dd] p-4 rounded-xs h-full shadow-sm border">
                    <h3 className="font-bold mb-4">{printer.name}</h3>

                    {printer.data.error ? (
                        <p className="text-[#9a0002]">{printer.data.error}</p>
                    ) : (
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={Object.entries(printer.data).map(([name, level]) => ({ name, level }))}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <XAxis dataKey="name" tick={{ fontSize: 7 }} />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Bar dataKey="level" barSize={30} fill="#9a0002" radius={[2, 2, 0, 0]}>
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}