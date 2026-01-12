import { Head, Link } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';
import Badge from '@/Components/PersonalBests/Badge';
import { Timer, Calendar, Route, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import ActivityModal from '../../Components/Modals/Activities/ActivityDetails';
import { route } from 'ziggy-js';

export default function PersonalBestsIndex({ personalBests }) {
    const { t } = useTranslation();
    const [selectedActivity, setSelectedActivity] = useState(null);

    return (
        <div className="bg-[#18181b] text-white min-h-screen p-4 sm:p-8">
            <Head title={t('personal_bests')} />

            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={route('dashboard.index')} className="p-3 rounded-full hover:bg-gray-800 text-gray-400 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{t('personal_bests') || "Records Pessoais"}</h1>
                        <p className="text-gray-400 text-sm">
                            {t('personal_bests_subtitle') || "As tuas conquistas e recordes de corrida num piscar de olhos."}
                        </p>
                    </div>
                </div>

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

            <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
        </div>
    );
}
