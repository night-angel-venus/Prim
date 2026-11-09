import { useEffect, useState } from 'react';
import type { FedexStats } from '../../types';
import { getFedexStats } from '../../services/dashboardService';

export default function FedexStatsCard() {
    const [stats, setStats] = useState<FedexStats | null>(null);

    useEffect(() => {
        getFedexStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading...</p>;

    return (
        // 1. Added flex-col, justify-between, and overflow-hidden
        <div className='bg-[#6A0DAD] text-white p-4 rounded-xs h-full flex flex-col justify-between overflow-hidden'>
            
            <div>
                {/* Logo */}
                <div className="mb-4">
                    <img src="/public/fedex_logo.svg" alt="fedex logo" className='h-10' />
                </div>

                {/* Total Visits */}
                <div className='flex items-baseline gap-2'>
                    {/* 2. Made the text slightly responsive (text-6xl instead of a massive fixed size) */}
                    <h3 className='m-0 text-7xl font-bold leading-none'>{stats.count_visits}</h3>
                    <p className='m-0 text-lg font-bold'>Total Visits</p>
                </div>
            </div>

            {/* Most Recent Visit */}
            <div className="mt-4">
                <p className="font-bold text-md mb-2">Most Recent Visit</p>
                
                {/* 3. The white box containing the details */}
                <div className="bg-white text-black rounded-xs p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold truncate pr-2">{stats.recent_visit_reason}</span>
                        <span className="bg-[#FF6B00] text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                            {stats.recent_visit_date}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}