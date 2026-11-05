import { useEffect, useState } from 'react';
import type { ReportsStats } from '../../types';
import { getReportsStats } from '../../services/dashboardService';

export default function GeneralStatsCard() {
    const [stats, setStats] = useState<ReportsStats | null>(null);

    useEffect(() => {
        getReportsStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading General Stats...</p>;

    return (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <h3>General Stats</h3>
            <p>Total Reports: <strong>{stats.count_reports}</strong></p>
            <p>Total Purchases: <strong>{stats.count_purchases}</strong></p>
            <p>Pending Deadlines: <strong style={{ color: 'red' }}>{stats.pending}</strong></p>
        </div>
    );
}