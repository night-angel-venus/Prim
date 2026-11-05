import { useEffect, useState } from 'react';
import type { EmployeeStats } from '../../types';
import { getEmployeeStats } from '../../services/dashboardService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeeStatsCard() {
    const [stats, setStats] = useState<EmployeeStats | null>(null);

    useEffect(() => {
        getEmployeeStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading...</p>;

    // Convert the dictionary { "IT": 5, "HR": 2 } into an array [{ name: 'IT', count: 5 }, ...]
    const chartData = Object.entries(stats.count_per_dept).map(([name, count]) => ({
        name,
        count
    }));

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Active Employees: {stats.count_active}</h3>
            
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}