import { useEffect, useState } from 'react';
import type { EmployeeStats } from '../../types';
import { getEmployeeStats } from '../../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import {
    Card,
    CardContent,
} from "../../components/ui/card"

export default function EmployeeStatsCard() {
    const [stats, setStats] = useState<EmployeeStats | null>(null);

    useEffect(() => {
        getEmployeeStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading...</p>;

    const chartData = Object.entries(stats.count_per_dept).map(([name, count]) => ({
        name,
        count
    }));

    return (
        <div className='grid grid-cols-[auto_1fr] gap-4'>
            <Card className='w-70 h-45 bg-[#4DA65A] text-[#efe6dd] font-bold rounded-xs'>
                <CardContent className='flex flex-col'>
                    <p className='text-[70px]'>{stats.count_active}</p>
                    <p className='text-lg'>Active Employees</p>
                </CardContent>
            </Card>

            {/* The Chart Card */}
            <div className='h-45 ring ring-gray-300 rounded-xs overflow-hidden'>
               
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={chartData} 
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        barCategoryGap={40}
                    >
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#9a0002" radius={[2, 2, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}