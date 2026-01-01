import { Link, router } from "@inertiajs/react";
import { Calendar, LifeBuoy, LogOut, MapPin, RefreshCw, Settings, Trophy, Route, Zap, Timer } from "lucide-react";
import { useState } from "react";

export default function DashboardSideContent({ raceGoal, stravaData }) {
    const [isSyncing, setIsSyncing] = useState(false);

    const weeklyDistance = stravaData.currentWeekDistance;
    const weeklyGoal = raceGoal.weeklyGoal;
    const progressPercent = Math.min((weeklyDistance / weeklyGoal) * 100, 100);
    const prediction = stravaData.racePrediction;

    const handleSync = () => {
        setIsSyncing(true);
        router.visit(route('dashboard.index'), {
            data: { refresh: true },
            only: ['stravaData', 'weeklyHistory'],
            preserveScroll: true,
            onFinish: () => setIsSyncing(false),
        });
    };

    return (
        <aside className="w-full lg:w-[30%] h-screen bg-[#000000] border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col justify-between p-6 lg:p-8 relative shrink-0 z-20">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-orange-500">
                        <Trophy size={20} className="lg:w-6 lg:h-6" />
                        <span className="text-xs lg:text-sm font-bold tracking-[0.2em] uppercase">Objetivo Principal</span>
                    </div>

                    <div className="flex gap-2">
                        <Link href={route('support.create')} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full cursor-pointer" title="Contactar Suporte">
                            <LifeBuoy size={20} />
                        </Link>
                        <Link href={route('goals.edit')} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full cursor-pointer" title="Editar Objetivo">
                            <Settings size={20} />
                        </Link>
                        <button onClick={handleSync} disabled={isSyncing} className={`p-2 rounded-full transition-all text-gray-400 hover:text-white hover:bg-gray-800 ${isSyncing ? 'animate-spin text-[#FC4C02]' : ''} cursor-pointer`} title="Sincronizar com Strava">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4 text-white">
                    {raceGoal.name}
                </h1>

                <div className="space-y-2 lg:space-y-3 text-gray-400 text-sm lg:text-lg">
                    <div className="flex items-center">
                        <Calendar className="mr-3 text-gray-600 w-4 h-4 lg:w-5 lg:h-5" /> {raceGoal.date}
                    </div>
                    <div className="flex items-center">
                        <MapPin className="mr-3 text-gray-600 w-4 h-4 lg:w-5 lg:h-5" /> {raceGoal.location}
                    </div>
                    {raceGoal.distance > 0 && (
                        <div className="flex items-center text-gray-300 font-medium">
                            <Route className="mr-3 text-[#FC4C02] w-4 h-4 lg:w-5 lg:h-5" /> 
                            {raceGoal.distance} km
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center py-6 lg:py-8">
                <span className="block text-[7rem] lg:text-[9rem] leading-none font-bold text-[#FC4C02] tracking-tighter">
                    {parseInt(raceGoal.daysLeft)}
                </span>
                <span className="text-sm lg:text-[1.2rem] uppercase tracking-widest text-gray-500 font-bold">Dias Restantes</span>
            </div>

            <div className="flex flex-col gap-4">
                
                <div className="bg-[#18181b] rounded-3xl p-5 border border-gray-800 space-y-5">
                    
                    {prediction && (
                        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-800 p-2 rounded-lg text-gray-400">
                                    <Timer size={18} />
                                </div>
                                <div>
                                    <p className="text-[12px] uppercase font-bold text-gray-300">Tempo Estimado</p>
                                    <p className="text-xs text-gray-400">Baseado no GAP</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl lg:text-2xl font-bold text-white block">{prediction.time_formatted}</span>
                                <span className="text-xs text-[#FC4C02] font-mono">@{prediction.predicted_pace}/km</span>
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-gray-400 uppercase text-xs lg:text-sm font-bold">Meta Semanal</span>
                            <span className="text-lg lg:text-xl font-bold text-white">
                                {weeklyDistance} <span className="text-sm text-gray-500">/ {weeklyGoal} km</span>
                            </span>
                        </div>
                        
                        <div className="h-2.5 lg:h-3 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${progressPercent >= 100 ? 'bg-green-500' : 'bg-[#FC4C02]'}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <div className="mt-2 text-right">
                            {progressPercent >= 100 ? (
                                <span className="text-green-500 font-bold flex justify-end items-center text-xs lg:text-sm">
                                    <Zap size={14} className="mr-1" /> Objetivo Cumprido!
                                </span>
                            ) : (
                                <span className="text-gray-500 text-xs lg:text-sm">
                                    Faltam {Math.max(0, (weeklyGoal - weeklyDistance)).toFixed(1)} km
                                </span>
                            )}
                        </div>
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
    );
}