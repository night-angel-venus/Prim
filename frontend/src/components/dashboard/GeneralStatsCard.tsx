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
        <div className='grid grid-cols-3 gap-3'>

            <div className='h-35 p-4 bg-[#E5B85C] text-[#161111]'>
                <h1 className='font-bold text-lg'>Issues Resolved</h1>

                <p className='text-[70px] font-bold'>{stats.count_reports}</p>
            </div>

            <div className='h-35 p-4 bg-[#00439A] text-[#efe6dd]'>

                <h1 className='font-bold text-lg'>Purchases</h1>
                <p className='text-[70px] font-bold'>{stats.count_purchases}</p>
            </div>

            <div className='h-35 p-4 bg-[#9A0002] text-[#efe6dd]'>
                <h1 className='font-bold text-lg'>Deadlines</h1>
                <p className='text-[70px] font-bold'>{stats.pending}</p>
            </div>
        </div>
    );
}