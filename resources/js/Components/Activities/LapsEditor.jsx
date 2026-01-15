import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Timer, RefreshCw, Save, Edit2, Trash2, Plus, X } from 'lucide-react';
import { route } from 'ziggy-js';
import useTranslation from '@/Hooks/useTranslation';

export default function LapsEditor({ activity }) {
    const { t } = useTranslation();
    const [laps, setLaps] = useState(activity.laps || []);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const calculatePace = (dist, time) => {
        if (!dist || !time) return '-';
        const speedMs = dist / time;
        const paceMinKm = (1000 / speedMs) / 60;
        const pm = Math.floor(paceMinKm);
        const ps = Math.round((paceMinKm - pm) * 60);
        return `${pm}:${ps.toString().padStart(2, '0')}`;
    };

    const handleFetch = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(route('activities.fetch-laps', activity.id));
            setLaps(res.data.laps);
        } catch (error) {
            console.error(error);
            alert(t('laps_error_fetch') || "Erro ao buscar splits.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        router.put(route('activities.update-laps', activity.id), {
            laps: laps
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
            },
            onError: (errors) => {
                console.error(errors);
                alert(t('laps_error_save') || "Erro ao guardar as alterações.");
            }
        });
    };

    const updateRow = (index, field, value) => {
        const newLaps = [...laps];
        newLaps[index] = { ...newLaps[index], [field]: parseFloat(value) };
        if (field === 'distance' || field === 'moving_time') {
            const d = field === 'distance' ? parseFloat(value) : newLaps[index].distance;
            const t = field === 'moving_time' ? parseFloat(value) : newLaps[index].moving_time;
            newLaps[index].average_speed = (d && t) ? d / t : 0;
        }
        setLaps(newLaps);
    };

    const addRow = () => {
        setLaps([...laps, { distance: 1000, moving_time: 300, average_speed: 3.33 }]);
    };

    const removeRow = (index) => {
        setLaps(laps.filter((_, i) => i !== index));
    };

    if (!laps || laps.length === 0) {
        return (
            <div className="mt-6 p-6 bg-[#27272a] rounded-3xl border border-gray-800 text-center">
                <p className="text-gray-400 mb-4">{t('laps_no_splits')}</p>
                <button
                    onClick={handleFetch}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 bg-[#FC4C02] text-white px-4 py-2 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                >
                    {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                    {isLoading ? t('laps_syncing') : t('laps_fetch_btn')}
                </button>
            </div>
        );
    }

    return (
        <div className="mt-6 bg-[#27272a] rounded-3xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#202022]">
                <div className="flex items-center gap-2">
                    <Timer size={16} className="text-[#FC4C02]" />
                    <h3 className="text-white font-bold text-sm uppercase">{t('laps_title')}</h3>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={() => setIsEditing(false)} className="p-2 text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
                            <button onClick={handleSave} className="p-2 text-green-500 hover:text-green-400 cursor-pointer"><Save size={18} /></button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-[#FC4C02] transition cursor-pointer">
                            <Edit2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#18181b] text-gray-500 uppercase font-bold sticky top-0 z-10">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">{t('laps_col_dist')}</th>
                            <th className="p-3">{t('laps_col_time')}</th>
                            <th className="p-3 text-right">{t('laps_col_pace')}</th>
                            {isEditing && <th className="p-3"></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {laps.map((lap, index) => (
                            <tr key={index} className="hover:bg-white/5">
                                <td className="p-3 text-gray-500">{index + 1}</td>

                                <td className="p-3 font-bold text-white">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-20 bg-black/30 border border-gray-700 rounded p-1 text-white"
                                            value={lap.distance}
                                            onChange={(e) => updateRow(index, 'distance', e.target.value)}
                                        />
                                    ) : (
                                        `${(lap.distance / 1000).toFixed(2)} km`
                                    )}
                                </td>

                                <td className="p-3 text-gray-300 font-mono">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                className="w-20 bg-black/30 border border-gray-700 rounded p-1 text-white"
                                                value={lap.moving_time}
                                                onChange={(e) => updateRow(index, 'moving_time', e.target.value)}
                                            />
                                            <span className="text-[10px] text-gray-500">{formatTime(lap.moving_time)}</span>
                                        </div>
                                    ) : (
                                        formatTime(lap.moving_time)
                                    )}
                                </td>

                                <td className="p-3 text-right font-mono text-[#FC4C02]">
                                    {calculatePace(lap.distance, lap.moving_time)}
                                </td>

                                {isEditing && (
                                    <td className="p-3 text-right">
                                        <button onClick={() => removeRow(index)} className="text-red-500 hover:text-red-400">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isEditing && (
                    <div className="p-3 border-t border-gray-800 text-center">
                        <button onClick={addRow} className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 w-full cursor-pointer">
                            <Plus size={14} /> {t('laps_add_row')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}