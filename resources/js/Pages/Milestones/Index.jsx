import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Timer, Medal } from 'lucide-react';
import { route } from 'ziggy-js';
import useTranslation from '@/Hooks/useTranslation';
import ActivityModal from '@/Components/Modals/Activities/ActivityDetails';
import PersonalBestsTab from '../../Components/Milestones/Tabs/PersonalBests';
import BadgesTab from '../../Components/Milestones/Tabs/Badges';

export default function MilestonesIndex({ allBadges, userBadges, personalBests }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('personal_bests');
    const [selectedActivity, setSelectedActivity] = useState(null);

    return (
        <div className="min-h-screen bg-[#18181b] text-white p-4 md:p-8">
            <Head title={t('achievements_title') || "Achievements"} />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    
                    <div className="flex items-center gap-4">
                        <Link href={route('dashboard.index')} className="p-3 rounded-full hover:bg-gray-800 text-gray-400 transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{t('achievements_title')}</h1>
                            <p className="text-gray-400 text-sm">
                                {t('achievements_subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="flex bg-[#27272a] p-1 rounded-xl self-start md:self-auto">
                        <button
                            onClick={() => setActiveTab('personal_bests')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'personal_bests' 
                                    ? 'bg-[#FC4C02] text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Timer size={16} />
                            {t('tab_records')}
                        </button>
                        <button
                            onClick={() => setActiveTab('badges')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'badges' 
                                    ? 'bg-[#FC4C02] text-white shadow-lg' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Medal size={16} />
                            {t('tab_trophies')}
                        </button>
                    </div>
                </div>

                {activeTab === 'personal_bests' && (
                    <PersonalBestsTab 
                        personalBests={personalBests} 
                        selectedActivity={selectedActivity} 
                        setSelectedActivity={setSelectedActivity} 
                    />
                )}

                {activeTab === 'badges' && (
                    <BadgesTab allBadges={allBadges} userBadges={userBadges} />
                )}
            </div>

            <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
        </div>
    );
}