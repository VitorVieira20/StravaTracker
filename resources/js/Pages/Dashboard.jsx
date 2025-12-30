import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Trophy, Calendar, MapPin, Activity, Timer, Zap, TrendingUp, Clock, LogOut, Settings } from 'lucide-react';

const SLIDE_DURATION = 15000;
const STRAVA_ORANGE = '#FC4C02';

export default function TVDashboard({ stravaData, raceGoal, weeklyHistory }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);

    const weeklyDistance = stravaData.currentWeekDistance;
    const weeklyGoal = raceGoal.weeklyGoal;
    const progressPercent = Math.min((weeklyDistance / weeklyGoal) * 100, 100);

    return (
        <div className="min-h-screen w-full bg-[#18181b] text-white font-sans flex flex-col lg:flex-row overflow-x-hidden">
            <Head title="TV Dashboard" />

            <aside className="w-full lg:w-[30%] h-auto lg:h-screen bg-[#000000] border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col justify-between p-6 lg:p-8 relative shrink-0 z-20">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-orange-500">
                            <Trophy size={20} className="lg:w-6 lg:h-6" />
                            <span className="text-xs lg:text-sm font-bold tracking-[0.2em] uppercase">Objetivo Principal</span>
                        </div>

                        <Link
                            href={route('goals.edit')}
                            className="text-gray-600 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                            title="Editar Objetivo"
                        >
                            <Settings size={18} />
                        </Link>
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-bold leading-tight mb-4 text-white">
                        {raceGoal.name}
                    </h1>
                    <div className="space-y-2 lg:space-y-4 text-gray-400 text-sm lg:text-lg">
                        <div className="flex items-center">
                            <Calendar className="mr-3 text-gray-600 w-4 h-4 lg:w-5 lg:h-5" /> {raceGoal.date}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-3 text-gray-600 w-4 h-4 lg:w-5 lg:h-5" /> {raceGoal.location}
                        </div>
                    </div>
                </div>

                <div className="text-center py-8 lg:py-10">
                    <span className="block text-6xl lg:text-[10rem] leading-none font-bold text-[#FC4C02] tracking-tighter">
                        {parseInt(raceGoal.daysLeft)}
                    </span>
                    <span className="text-sm lg:text-xl uppercase tracking-widest text-gray-500 font-bold">Dias Restantes</span>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-[#18181b] rounded-3xl p-6 border border-gray-800">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-gray-400 uppercase text-xs lg:text-md font-bold">Esta Semana</span>
                            <span className="text-xl lg:text-3xl font-bold text-white">{weeklyDistance} <span className="text-sm text-gray-500">/ {weeklyGoal} km</span></span>
                        </div>
                        <div className="h-3 lg:h-4 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#FC4C02] transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="mt-3 text-right">
                            {progressPercent >= 100 ? (
                                <span className="text-green-500 font-bold flex justify-end items-center text-sm"><Zap size={14} className="mr-1" /> Meta Atingida!</span>
                            ) : (
                                <span className="text-gray-500 text-sm lg:text-md">Faltam {Math.max(0, (weeklyGoal - weeklyDistance)).toFixed(1)} km</span>
                            )}
                        </div>
                    </div>
                    <div className="w-full">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center justify-center gap-2 w-full text-white bg-red-600/80 hover:bg-red-600/60 px-4 py-3 lg:py-2 rounded-2xl transition-all duration-300 text-sm lg:text-lg font-medium uppercase tracking-wider group cursor-pointer"
                        >
                            <span className="inline">Sair</span>
                            <LogOut size={16} />
                        </Link>
                    </div>
                </div>
            </aside>

            <main className="w-full lg:w-[70%] h-auto lg:h-screen relative bg-[#18181b] p-4 lg:p-12 lg:px-8 flex flex-col justify-start lg:justify-center z-10">
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex gap-2 z-50">
                    {[0, 1, 2].map((idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 lg:h-2 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-6 lg:w-8 bg-[#FC4C02]' : 'w-1.5 lg:w-2 bg-gray-700'}`}
                        />
                    ))}
                </div>

                {currentSlide === 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col pt-8 lg:pt-0">
                        <h2 className="text-xl lg:text-3xl font-bold text-gray-200 mb-8 flex items-center">
                            <TrendingUp className="mr-3 text-[#FC4C02]" size={32} />
                            <div className="flex flex-col lg:flex-row lg:items-center">
                                <span>Evolução de</span>
                                <span className="lg:ml-2 text-gray-400 lg:text-gray-200">(4 Semanas)</span>
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
                                <p className="text-gray-400 uppercase text-xs font-bold">Total Acumulado</p>
                                <p className="text-2xl lg:text-4xl font-black text-white mt-2">{stravaData.totalDistance} <span className="text-lg text-gray-500 font-normal">km</span></p>
                            </div>
                            <div className="w-full bg-[#27272a] p-4 lg:p-6 rounded-2xl border-l-4 border-gray-600">
                                <p className="text-gray-400 uppercase text-xs font-bold">Pace Médio (Recente)</p>
                                <p className="text-2xl lg:text-4xl font-black text-white mt-2">{stravaData.recentAvgPace} <span className="text-lg text-gray-500 font-normal">/km</span></p>
                            </div>
                        </div>
                    </div>
                )}

                {currentSlide === 1 && stravaData.activities.length > 0 && (
                    <div className="animate-in fade-in zoom-in duration-700 h-full flex flex-col justify-center pt-8 lg:pt-0">
                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-200 flex items-center">
                                <Activity className="mr-3 text-[#FC4C02]" size={32} /> Último Treino
                            </h2>
                            <span className="text-sm lg:text-xl text-gray-400 bg-gray-800 px-4 py-1 rounded-full">{stravaData.activities[0].date}</span>
                        </div>

                        <div className="bg-[#27272a] rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 border border-gray-700 shadow-2xl relative overflow-hidden">
                            <Activity className="absolute -right-10 -bottom-10 text-white opacity-5 w-48 h-48 lg:w-96 lg:h-96" />

                            <h3 className="text-3xl lg:text-5xl font-bold text-white mb-2">{stravaData.activities[0].name}</h3>

                            <div className="flex flex-col lg:flex-row gap-8 mt-8 lg:mt-12 relative z-10">
                                <div className="w-full text-center">
                                    <MapPin size={32} className="mx-auto text-[#FC4C02] mb-2 lg:mb-4 lg:w-12 lg:h-12" />
                                    <div className="text-4xl lg:text-8xl font-bold text-white tracking-tighter">
                                        {stravaData.activities[0].distance}
                                    </div>
                                    <div className="text-sm lg:text-2xl text-gray-400 uppercase font-bold tracking-widest mt-2">Quilómetros</div>
                                </div>
                                <div className="w-full text-center lg:border-l lg:border-gray-700 lg:border-r pt-4 lg:pt-0 border-t border-gray-700 lg:border-t-0">
                                    <Timer size={32} className="mx-auto text-gray-400 mb-2 lg:mb-4 lg:w-12 lg:h-12" />
                                    <div className="text-4xl lg:text-7xl font-bold text-white tracking-tighter mt-4">
                                        {stravaData.activities[0].pace}
                                    </div>
                                    <div className="text-sm lg:text-2xl text-gray-400 uppercase font-bold tracking-widest mt-4">Min / Km</div>
                                </div>
                                <div className="w-full text-center pt-4 lg:pt-0 border-t border-gray-700 lg:border-t-0">
                                    <Clock size={32} className="mx-auto text-gray-400 mb-2 lg:mb-4 lg:w-12 lg:h-12" />
                                    <div className="text-4xl lg:text-7xl font-bold text-white tracking-tighter mt-4">
                                        {stravaData.activities[0].time}
                                    </div>
                                    <div className="text-sm lg:text-2xl text-gray-400 uppercase font-bold tracking-widest mt-4">Tempo Total</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentSlide === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-700 h-auto flex flex-col justify-start pt-12 lg:pt-0">

                        <div className="mb-4 lg:hidden">
                            <h2 className="text-xl font-bold text-gray-200 flex items-center">
                                <Calendar className="mr-2 text-[#FC4C02]" size={20} /> Histórico
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 w-full h-auto content-start">

                            {weeklyHistory.slice(0, 20).map((week, idx) => {
                                const isGoodWeek = week.total_distance > 30;
                                const isZeroWeek = week.total_distance === 0;

                                return (
                                    <div
                                        key={idx}
                                        className={`
                                            relative rounded-xl p-3 lg:p-4 flex flex-col justify-between border-t-4 shadow-lg transition-transform duration-500
                                            ${isGoodWeek ? 'bg-[#27272a] border-[#FC4C02]' : 'bg-[#202022] border-gray-700'}
                                            ${isZeroWeek ? 'opacity-50 grayscale' : 'opacity-100'}
                                        `}
                                        style={{ aspectRatio: '1.4/1' }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs lg:text-lg uppercase font-bold text-gray-100 tracking-wider">
                                                {week.week_label.split('-')[0]}
                                            </span>
                                            {week.activity_count > 0 && (
                                                <span className="bg-gray-800 text-gray-300 text-[10px] lg:text-xs px-2 py-0.5 rounded-full font-bold">
                                                    {week.activity_count} x
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-center my-1 lg:my-2">
                                            <span className="block text-2xl lg:text-3xl font-bold text-white mb-0.5">
                                                {week.total_distance}
                                            </span>
                                            <span className="text-[10px] lg:text-xs text-gray-600 uppercase font-bold">km</span>
                                        </div>

                                        <div className="flex justify-center items-center gap-1 text-gray-500 text-xs lg:text-sm font-medium bg-black/20 py-1 rounded-lg">
                                            <Timer size={10} className="lg:w-3 lg:h-3" />
                                            {week.total_time}
                                        </div>

                                        {isGoodWeek && (
                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#FC4C02]"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-wrap w-full gap-1 lg:gap-1.5 content-center mt-6 lg:mt-10 mb-8 justify-center lg:justify-start">
                            {[...weeklyHistory].reverse().map((week, idx) => {
                                let intensityClass = "bg-gray-800";
                                if (week.total_distance > 0) intensityClass = "bg-[#FC4C02]/30";
                                if (week.total_distance > 15) intensityClass = "bg-[#FC4C02]/60";
                                if (week.total_distance > 30) intensityClass = "bg-[#FC4C02]";

                                return (
                                    <div
                                        key={idx}
                                        className={`w-3 h-5 lg:w-5 lg:h-8 rounded-sm transition-all duration-500 hover:scale-125 ${intensityClass}`}
                                        title={`${week.week_label}: ${week.total_distance}km`}
                                    ></div>
                                );
                            })}

                            {Array.from({ length: Math.max(0, 52 - weeklyHistory.length) }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="w-3 h-5 lg:w-5 lg:h-8 rounded-sm bg-gray-900/50 border border-gray-800"></div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div >
    );
}