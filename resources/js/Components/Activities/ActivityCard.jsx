import { Calendar, Route, Timer, Zap, Clock } from 'lucide-react';

export default function ActivityCard({ run, setSelectedActivity }) {
    const formatDate = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-PT', {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        }).format(date);
    };

    const formatDistance = (meters) => {
        if (!meters) return '0.00';
        return (meters / 1000).toFixed(2);
    };

    const formatTime = (seconds) => {
        if (!seconds) return '00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const mDisplay = m < 10 ? `0${m}` : m;
        const sDisplay = s < 10 ? `0${s}` : s;

        if (h > 0) {
            return `${h}:${mDisplay}:${sDisplay}`;
        }
        return `${mDisplay}:${sDisplay}`;
    };

    const calculatePace = (speedMs) => {
        if (!speedMs || speedMs <= 0) return '00:00';
        const secondsPerKm = 1000 / speedMs;

        const m = Math.floor(secondsPerKm / 60);
        const s = Math.floor(secondsPerKm % 60);

        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const distanceKm = formatDistance(run.distance);
    const pace = calculatePace(run.average_speed);
    const time = formatTime(run.moving_time);
    const watts = run.average_watts ? Math.round(run.average_watts) : null;

    return (
        <div
            onClick={() => setSelectedActivity(run)}
            className="group relative bg-[#27272a] rounded-3xl p-6 border border-gray-800 hover:border-[#FC4C02] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between h-full cursor-pointer"
        >
            <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full">
                        <Calendar size={12} />
                        {formatDate(run.start_date_local)}
                    </span>

                    {watts && (
                        <span className="flex items-center gap-1 text-sm font-bold text-yellow-500/80" title="Potência Média">
                            <Zap size={12} /> {watts}w
                        </span>
                    )}
                </div>

                <h3 className="text-white font-bold text-xl leading-tight group-hover:text-[#FC4C02] transition-colors line-clamp-2">
                    {run.name}
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-[#18181b] p-3 rounded-2xl border border-gray-700/50">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold mb-1">
                        <Route size={12} /> Distância
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {distanceKm} <span className="text-sm font-medium text-gray-500">km</span>
                    </div>
                </div>

                <div className="bg-[#18181b] p-3 rounded-2xl border border-gray-700/50">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold mb-1">
                        <Timer size={12} /> Pace
                    </div>
                    <div className="text-2xl font-bold text-[#FC4C02]">
                        {pace}
                    </div>
                </div>

                <div className="col-span-2 flex items-center justify-between bg-[#18181b] px-4 py-2 rounded-xl border border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase">
                        <Clock size={14} /> Tempo Total
                    </div>
                    <div className="font-mono text-lg text-gray-300 font-medium">
                        {time}
                    </div>
                </div>
            </div>
        </div>
    );
};