import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import useTranslation from '@/Hooks/useTranslation';

const STRAVA_ORANGE = '#FC4C02';

export default function ChartSlide({ stravaData }) {
    const { t } = useTranslation();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col pt-8 lg:pt-0">
            <h2 className="text-xl lg:text-3xl font-bold text-gray-200 mb-8 flex items-center">
                <TrendingUp className="mr-3 text-[#FC4C02]" size={32} />
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <span>{t('slide_evol_title')}</span>
                    <span className="lg:ml-2 text-gray-400 lg:text-gray-200">{t('slide_evol_sub')}</span>
                </div>
            </h2>
            <div className="h-64 lg:flex-1 w-full bg-[#27272a] rounded-3xl p-4 lg:p-8 border border-gray-800 shadow-2xl">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stravaData.chartData}>
                        <defs>
                            <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={STRAVA_ORANGE} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={STRAVA_ORANGE} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 600 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="km"
                            stroke={STRAVA_ORANGE}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorKm)"
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mt-4 lg:mt-8">
                <div className="w-full bg-[#27272a] p-4 lg:p-6 rounded-2xl border-l-4 border-[#FC4C02]">
                    <p className="text-gray-400 uppercase text-xs font-bold">{t('slide_total_acc')}</p>
                    <p className="text-2xl lg:text-4xl font-black text-white mt-2">{stravaData.totalDistance} <span className="text-lg text-gray-500 font-normal">km</span></p>
                </div>
                <div className="w-full bg-[#27272a] p-4 lg:p-6 rounded-2xl border-l-4 border-gray-600">
                    <p className="text-gray-400 uppercase text-xs font-bold">{t('slide_recent_pace')}</p>
                    <p className="text-2xl lg:text-4xl font-black text-white mt-2">{stravaData.recentAvgPace} <span className="text-lg text-gray-500 font-normal">/km</span></p>
                </div>
            </div>
        </div>
    );
}