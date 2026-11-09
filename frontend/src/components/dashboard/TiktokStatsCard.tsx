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

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthOrder.map(month => ({
        month,
        applicants: stats.count_applicants_per_month[month] || 0
    }));

    return (
        // 1. The outer container MUST have overflow-hidden and flex-col
        <div className='bg-[#161111] text-[#efe6dd] p-3 rounded-xs h-full flex flex-col overflow-hidden'>
            
            {/* 2. The grid. Removed the fixed width (w-70) and added min-w-0 */}
            <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 h-full w-full min-h-0'>
                
                {/* Left side text */}
                <div className='flex flex-col gap-1 justify-center min-w-0'>
                    <div className='flex flex-row gap-2 mb-1'>
                        <img src="/public/tiktok_logo.svg" alt="tiktok logo" className='h-6' />
                    </div>
                    <div className='flex flex-row items-baseline gap-2 justify-between'>
                        <h3 className='m-0 text-3xl font-bold'>{stats.count_tiktok_lives}</h3>
                        <p className='m-0 text-sm font-bold text-[#efe6dd]'>TikTok Live Sessions</p>
                    </div>

                    <Progress value={0} />
                    
                    <div className='flex flex-row items-baseline gap-2 justify-between'>
                        <h3 className='m-0 text-3xl font-bold'>{stats.count_applicants_current_month}</h3>
                        <p className='m-0 text-sm font-bold text-[#efe6dd]'>Applicants this month</p>
                    </div>
                </div>

                {/* Right side chart */}
                {/* 3. Use relative and absolute inset-0 to force Recharts to shrink exactly to this box */}
                <div className='relative w-full h-full min-h-25 z-0'>
                    <div className="absolute inset-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <XAxis
                                    dataKey="month"
                                    stroke="#aaa"
                                    tick={{ fontSize: 10 }}
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
                                    strokeWidth={2}
                                    dot={{ r: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}