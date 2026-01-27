import { useForm } from '@inertiajs/react';
import { X, Trophy, Calendar, Activity, Timer, TrendingUp, MapPin } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { route } from 'ziggy-js';

export default function CreateChallengeModal({ isOpen, onClose, groupId }) {
    const { t } = useTranslation();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'total_distance',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('challenges.store', groupId), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    const challengeTypes = [
        { value: 'total_distance', label: 'challenge_type_total_distance', icon: MapPin },
        { value: 'total_time', label: 'challenge_type_total_time', icon: Timer },
        { value: 'max_elevation', label: 'challenge_type_max_elevation', icon: TrendingUp },
        { value: 'max_distance', label: 'challenge_type_max_distance', icon: Activity },
        { value: 'most_activities', label: 'challenge_type_most_activities', icon: Trophy },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-[#18181b] w-full max-w-lg rounded-3xl border border-gray-800 p-8 relative z-10 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="text-[#FC4C02]" size={24} />
                    {t('challenge_create_title')}
                </h2>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('challenge_name_label')}</label>
                        <input
                            type="text"
                            className="w-full bg-[#27272a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#FC4C02] focus:ring-0"
                            placeholder={t('challenge_name_placeholder')}
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('challenge_type_label')}</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {challengeTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = data.type === type.value;
                                return (
                                    <div
                                        key={type.value}
                                        onClick={() => setData('type', type.value)}
                                        className={`cursor-pointer p-3 rounded-xl border flex items-center gap-3 transition-all ${isSelected
                                                ? 'bg-[#FC4C02]/10 border-[#FC4C02] text-white'
                                                : 'bg-[#27272a] border-gray-700 text-gray-400 hover:border-gray-500'
                                            }`}
                                    >
                                        <Icon size={18} className={isSelected ? 'text-[#FC4C02]' : ''} />
                                        <span className="text-xs font-bold">{t(type.label)}</span>
                                    </div>
                                )
                            })}
                        </div>
                        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('challenge_start_date')}</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-3.5 text-gray-500 pointer-events-none" />
                                <input
                                    type="date"
                                    className="w-full bg-[#27272a] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#FC4C02] focus:ring-0 [color-scheme:dark] cursor-pointer"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                />
                            </div>
                            {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('challenge_end_date')}</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-3.5 text-gray-500 pointer-events-none" />
                                <input
                                    type="date"
                                    className="w-full bg-[#27272a] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#FC4C02] focus:ring-0 [color-scheme:dark] cursor-pointer"
                                    value={data.end_date}
                                    onChange={e => setData('end_date', e.target.value)}
                                />
                            </div>
                            {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-semibold hover:bg-white/5 transition-colors cursor-pointer">
                            {t('groups_cancel')}
                        </button>
                        <button disabled={processing} className="flex-1 bg-[#FC4C02] hover:bg-[#e34402] text-white py-3 rounded-xl font-semibold shadow-lg shadow-orange-900/20 transition-all cursor-pointer">
                            {t('challenge_create_btn')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}