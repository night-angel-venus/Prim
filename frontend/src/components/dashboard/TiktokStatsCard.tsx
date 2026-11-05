import { useEffect, useState } from 'react';
import type { TiktokStats } from '../../types';
import { getTiktokStats } from '../../services/dashboardService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TiktokStatsCard() {
    const [stats, setStats] = useState<TiktokStats | null>(null);

    useEffect(() => {
        getTiktokStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading...</p>;

    // Convert { "Jan": 45, "Feb": 60 } to [{ month: 'Jan', applicants: 45 }, ...]
    // We sort it by the standard month order
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = Object.entries(stats.count_applicants_per_month)
        .map(([month, applicants]) => ({ month, applicants }))
        .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    return (
        <div style={{ background: 'black', color: 'white', padding: '20px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '32px' }}>{stats.count_tiktok_lives}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>TikTok Live Sessions</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h3 style={{ margin: 0, fontSize: '32px' }}>{stats.count_applicants_current_month}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>Applicants This Month</p>
                </div>
            </div>

            {/* The Line Chart */}
            <div style={{ width: '100%', height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="month" stroke="#aaa" />
                        <Tooltip />
                        <Line type="monotone" dataKey="applicants" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}