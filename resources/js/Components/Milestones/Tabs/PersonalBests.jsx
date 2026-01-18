import useTranslation from '@/Hooks/useTranslation';
import Badge from '@/Components/PersonalBests/Badge';
import { Timer, Calendar, Route } from 'lucide-react';

export default function PersonalBestsTab({ personalBests, selectedActivity, setSelectedActivity }) {
    const { t } = useTranslation();

    return (
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(personalBests).map(([distance, record]) => (
                        <div
                            key={distance}
                            className="group relative bg-[#27272a] rounded-3xl p-6 border border-gray-800 transition-all duration-300 hover:border-[#FC4C02] hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Badge type={record.badge} />
                                    <span className="text-md font-bold uppercase tracking-wider text-gray-400">
                                        {distance}
                                    </span>
                                </div>
                            </div>

                            {record.message ? (
                                <div className="flex items-center justify-center flex-1">
                                    <p className="text-gray-500 text-center">
                                        {record.message}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <p className="text-5xl font-semibold text-white group-hover:text-[#FC4C02] transition-colors">
                                            {record.calculated_time}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-[#18181b] p-3 rounded-2xl border border-gray-700/50">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold mb-1">
                                                <Timer size={12} />
                                                {t('average_pace')}
                                            </div>
                                            <div className="text-lg font-semibold text-white">
                                                {record.pace}
                                            </div>
                                        </div>

                                        <div className="bg-[#18181b] p-3 rounded-2xl border border-gray-700/50">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold mb-1">
                                                <Calendar size={12} />
                                                {t('date')}
                                            </div>
                                            <div className="text-sm font-medium text-gray-300">
                                                {record.data}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#18181b] px-4 py-3 rounded-xl border border-gray-700/50 mb-6">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1">
                                            <Route size={12} />
                                            {t('based_on_activity')}
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-2">
                                            {record.based_on_activity}
                                        </p>
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => setSelectedActivity(record.activity)}
                                        className="mt-auto block w-full text-center bg-[#FC4C02] text-white py-2.5 rounded-xl font-semibold hover:bg-opacity-90 transition cursor-pointer"
                                    >
                                        {t('view_activity')}
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
        </div>
    );
}
