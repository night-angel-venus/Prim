import { useEffect, useState } from 'react';
import type { TiktokStats } from '../../types';
import { getTiktokStats } from '../../services/dashboardService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Progress } from '../ui/progress';


export default function TiktokStatsCard() {
    const [stats, setStats] = useState<TiktokStats | null>(null);

    useEffect(() => {
        getTiktokStats().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading...</p>;

    // Fill out the full 12-month timeline so the line spans the whole graph
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthOrder.map(month => ({
        month,
        applicants: stats.count_applicants_per_month[month] || 0
    }));

    return (
        <div className='bg-[#161111] text-[#efe6dd] p-3 rounded-xs grid grid-cols-[auto_1fr] gap-3 h-45'>
            
            {/* Stats Section */}
            <div className='flex flex-col gap-3 p-4 w-70 justify-center'>
                <div className='flex flex-row items-baseline justify-between gap-2'>
                    <h3 className='m-0 text-4xl font-bold'>{stats.count_tiktok_lives}</h3>
                    <p className='m-0 text-md text-[#efe6dd]'>TikTok Live Sessions</p>
                </div>

                <Progress value={0} className="col-span-2 " />
                <div className='flex flex-row items-baseline justify-between gap-2'>
                    <h3 className='m-0 text-4xl font-bold'>{stats.count_applicants_current_month}</h3>
                    <p className='m-0 text-md text-[#efe6dd]'>Applicants this month</p>
                </div>
            </div>

            {/* Chart Section */}
            {/* Added min-w-0 to prevent Recharts from overflowing the grid cell */}
            <div className='w-full h-full min-w-0'>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={chartData} 
                        margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                    >
                        {/* interval={0} forces all 12 months to render */}
                        <XAxis 
                            dataKey="month" 
                            stroke="#aaa" 
                            tick={{ fontSize: 12 }} 
                            interval={0} 
                        />
                        <YAxis hide={true} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="applicants" 
                            stroke="#efe6dd" 
                            strokeWidth={3} 
                            dot={{ r:  4}} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
}