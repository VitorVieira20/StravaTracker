import { Head, Link } from '@inertiajs/react';
import { Plus, Users, Search, ArrowLeft, Clock } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import GroupCard from '@/Components/Groups/GroupCard';
import CreateGroupModal from '@/Components/Modals/Groups/CreateGroup';
import { useState } from 'react';
import FlashToast from '../../Components/UI/FlashToast';

export default function GroupsIndex({ myGroups, pendingGroups, suggestedGroups }) {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#18181b] text-white p-4 md:p-8">
            <Head title={t('community_title')} />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <Link href={route('dashboard.index')} className="p-3 rounded-full hover:bg-gray-800 text-gray-400 transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className='flex flex-col'>
                            <h1 className="text-3xl font-bold mb-1">{t('groups_title')}</h1>
                            <p className="text-gray-400 text-sm">{t('groups_subtitle')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 cursor-pointer"
                    >
                        <Plus size={20} /> {t('groups_create_btn')}
                    </button>
                </div>

                {pendingGroups && pendingGroups.length > 0 && (
                    <div className="mb-12 animate-fade-in">
                        <div className="flex items-center gap-2 mb-6">
                            <Clock size={20} className="text-yellow-500" />
                            <h2 className="text-xl font-semibold uppercase tracking-wide text-yellow-500">
                                {t('groups_pending_requests') || "Pending Requests"}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 hover:opacity-100 transition-opacity">
                            {pendingGroups.map(group => (
                                <div key={group.id} className="relative">
                                    <div className="absolute -top-2.5 right-4 z-10 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                                        {t('groups_status_pending') || "Pending"}
                                    </div>
                                    <GroupCard group={group} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Users size={20} className="text-[#FC4C02]" />
                        <h2 className="text-xl font-semibold uppercase tracking-wide">{t('groups_my_groups')}</h2>
                    </div>

                    {myGroups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myGroups.map(group => <GroupCard key={group.id} group={group} />)}
                        </div>
                    ) : (
                        <div className="bg-[#27272a] rounded-3xl p-8 text-center border border-gray-800 border-dashed">
                            <p className="text-gray-500 mb-4">{t('groups_empty_state')}</p>
                            <button onClick={() => setIsCreateModalOpen(true)} className="text-[#FC4C02] font-bold hover:underline">
                                {t('groups_create_first')}
                            </button>
                        </div>
                    )}
                </div>

                {suggestedGroups.length > 0 &&
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <Search size={20} className="text-gray-400" />
                            <h2 className="text-xl font-semibold uppercase tracking-wide text-gray-400">{t('groups_discover')}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                            {suggestedGroups.map(group => <GroupCard key={group.id} group={group} />)}
                        </div>
                    </div>
                }
            </div>

            <CreateGroupModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <FlashToast />
        </div>
    );
}