import { useEffect, useState } from 'react';
import type { FedexStats } from '../../types';
import { getFedexStats } from '../../services/dashboardService';

export default function FedexStatsCard() {
    const [stats, setStats] = useState<FedexStats | null>(null);

    useEffect(() => {
        getFedexStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading FedEx Stats...</p>;

    return (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <h3>FedEx Visits</h3>
            <p>Total Visits: <strong>{stats.count_visits}</strong></p>
            <p>Most Recent Visit: {stats.recent_visit_date || 'None'}</p>
            <p>Reason: {stats.recent_visit_reason || 'None'}</p>
        </div>
    );
}