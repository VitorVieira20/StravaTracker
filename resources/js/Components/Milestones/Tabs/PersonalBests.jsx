import useTranslation from '@/Hooks/useTranslation';
import Badge from '@/Components/PersonalBests/Badge';
import { Calendar, ArrowRight, BookDashed } from 'lucide-react';

export default function PersonalBestsTab({ personalBests, setSelectedActivity }) {
    const { t } = useTranslation();

    const distanceOrder = [
        "dist_400m", "dist_1km", "dist_1mile", "dist_5km", "dist_10km",
        "dist_half_marathon", "dist_marathon", "dist_50km", "dist_100km"
    ];

    const sortedPersonalBests = Object.entries(personalBests).sort(([distA], [distB]) => {
        return distanceOrder.indexOf(distA) - distanceOrder.indexOf(distB);
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPersonalBests.map(([distanceKey, record]) => (
                    <div
                        key={distanceKey}
                        className={`group relative bg-[#27272a] rounded-2xl p-6 border border-white/10 transition-all duration-300 flex flex-col ${record.message ? 'items-center justify-center text-center' : 'hover:border-[#FC4C02] hover:shadow-xl hover:-translate-y-1'}`}
                    >
                        <div className={`w-full flex items-center mb-6 ${record.message ? 'justify-center' : 'justify-between'}`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Badge type={record.badge} />
                                </div>
                                <span className="text-md font-bold uppercase tracking-wider text-gray-300">
                                    {t(distanceKey)}
                                </span>
                            </div>
                        </div>

                        {record.message ? (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <BookDashed className="text-gray-600" size={32} />
                                <p className="text-gray-500 text-sm max-w-xs">
                                    {t('dist_not_completed')}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <p className="text-5xl font-semibold text-white group-hover:text-[#FC4C02] transition-colors">
                                        {record.calculated_time}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                        <Calendar size={12} />
                                        {record.data}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                                    <div className="bg-[#18181b] p-3 rounded-lg border border-white/10">
                                        <div className="text-gray-400 text-xs font-bold mb-1">
                                            {t('average_pace')}
                                        </div>
                                        <div className="text-lg font-semibold text-white">
                                            {record.pace} <span className="text-xs text-gray-500 font-normal">/km</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#18181b] p-3 rounded-lg border border-white/10">
                                        <div className="text-gray-400 text-xs font-bold mb-1">
                                            {t('card_dist')}
                                        </div>
                                        <div className="text-lg font-semibold text-white">
                                            {(record.activity.distance / 1000).toFixed(2)} <span className="text-xs text-gray-500 font-normal ml-0.5">km</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-400 mb-6">
                                    <span className="font-bold text-gray-300">{t('based_on_activity')}:</span> {record.based_on_activity}
                                </div>

                                <button
                                    type='button'
                                    onClick={() => setSelectedActivity(record.activity)}
                                    className="mt-auto block w-full text-center bg-[#FC4C02]/10 border-2 border-[#FC4C02]/30 text-[#FC4C02] py-2.5 rounded-lg font-semibold hover:bg-[#FC4C02]/20 hover:border-[#FC4C02]/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {t('view_activity')}
                                    <ArrowRight size={16} />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
