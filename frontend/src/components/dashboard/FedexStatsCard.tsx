import { useEffect, useState } from 'react';
import type { FedexStats } from '../../types';
import { getFedexStats } from '../../services/dashboardService';

import {
    Card,
    CardContent,
} from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"


export default function FedexStatsCard() {
    const [stats, setStats] = useState<FedexStats | null>(null);

    useEffect(() => {
        getFedexStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading FedEx Stats...</p>;

    return (
        <div className='h-full flex flex-col bg-[#4D148C] rounded-xs p-4 text-[#efe6dd]'>

            <div className='flex items-start'>
                <img src="/public/fedex_logo.svg" className='h-10 mb-0' />
            </div>

            <div className='flex flex-row gap-2 items-baseline'>

                <h1 className='text-[100px] font-bold'>{stats.count_visits}</h1>
                <p className='text-2xl font-bold'>Total Visits</p>
            </div>

            <div>

                <h1 className='font-bold mb-3'>Most Recent Visit</h1>

                <Card className='bg-[#efe6dd] p-1 rounded-xs'>

                    <CardContent className='flex flex-row items-center justify-between'>
                        <h1 className='font-bold text-md text-[#4D148C]'>{stats.recent_visit_reason || 'None'}</h1>
                        <Badge variant="default" className=' bg-[#FF6600]'>{stats.recent_visit_date || 'None'}</Badge>
                    </CardContent>

                </Card>

            </div>
        </div>
    );
}