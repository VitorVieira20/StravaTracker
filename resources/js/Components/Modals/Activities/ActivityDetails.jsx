import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Navigation, Timer, Zap, Activity, X } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import polyline from '@mapbox/polyline';
import 'leaflet/dist/leaflet.css';

function FitBounds({ positions }) {
    const map = useMap();
    useEffect(() => {
        if (positions && positions.length > 0) {
            map.invalidateSize();
            map.fitBounds(positions, { padding: [50, 50] });
        }
    }, [positions, map]);
    return null;
}

export default function ActivityModal({ activity, onClose }) {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (activity?.map_polyline) {
            try {
                const decoded = polyline.decode(activity.map_polyline);
                setPositions(decoded);
            } catch (error) {
                console.error("Erro mapa", error);
            }
        }
    }, [activity]);

    if (!activity) return null;

    const formatDistance = (meters) => (meters / 1000).toFixed(2);
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return h > 0
            ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const calculatePace = (speedMs) => {
        if (!speedMs || speedMs <= 0) return '00:00';
        const secondsPerKm = 1000 / speedMs;
        const m = Math.floor(secondsPerKm / 60);
        const s = Math.floor(secondsPerKm % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const pace = calculatePace(activity.average_speed);
    const dateObj = new Date(activity.start_date_local || activity.date);
    const dateStr = new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(dateObj).replace(',', '');
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="bg-[#18181b] w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-800 overflow-hidden relative z-10 flex flex-col max-h-[90vh]">

                <div className="p-6 border-b border-gray-800 flex justify-between items-start bg-[#18181b]">
                    <div>
                        <div className="flex items-center gap-2 text-[#FC4C02] font-bold text-sm uppercase tracking-wider mb-2">
                            <Activity size={16} /> {activity.type || 'Run'}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white line-clamp-1">{activity.name}</h2>
                        <p className="text-gray-400 mt-1 flex items-center gap-2 text-sm">
                            <Calendar size={14} /> {dateStr}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="space-y-4">
                        <div className="bg-[#27272a] p-6 rounded-3xl border border-gray-800">
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-y-8 gap-x-4">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold mb-1">
                                        <MapPin size={14} /> Distância
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {formatDistance(activity.distance)} <span className="text-sm text-gray-500 font-medium">km</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold mb-1">
                                        <Clock size={14} /> Tempo
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {formatTime(activity.moving_time)}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold mb-1">
                                        <Timer size={14} /> Pace
                                    </div>
                                    <div className="text-2xl font-bold text-[#FC4C02]">
                                        {pace}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase font-bold mb-1">
                                        <Navigation size={14} /> Elevação
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {activity.total_elevation_gain} <span className="text-sm text-gray-500 font-medium">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#27272a] p-4 rounded-3xl border border-gray-800 flex flex-col justify-center items-center">
                                <Zap size={20} className="text-yellow-500 mb-2" />
                                <div className="text-xl font-bold text-white">{Math.round(activity.average_watts || 0)}w</div>
                                <div className="text-[10px] text-gray-500 uppercase">Potência</div>
                            </div>
                            <div className="bg-[#27272a] p-4 rounded-3xl border border-gray-800 flex flex-col justify-center items-center">
                                <Activity size={20} className="text-red-500 mb-2" />
                                <div className="text-xl font-bold text-white">{Math.round(activity.average_heartrate || 0)} bpm</div>
                                <div className="text-[10px] text-gray-500 uppercase">Cardíaco</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 h-75 lg:h-auto min-h-75 bg-[#27272a] rounded-3xl border border-gray-800 overflow-hidden relative shadow-inner">
                        {positions.length > 0 ? (
                            <MapContainer
                                center={positions[0]}
                                zoom={13}
                                scrollWheelZoom={false}
                                style={{ height: '100%', width: '100%', background: '#18181b' }}
                            >
                                <TileLayer
                                    attribution='&copy; CARTO'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                <Polyline positions={positions} color="#FC4C02" weight={4} opacity={0.8} />
                                <FitBounds positions={positions} />
                            </MapContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <MapPin size={48} className="mb-4 opacity-50" />
                                <p>Mapa não disponível</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}