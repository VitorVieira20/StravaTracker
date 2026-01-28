import { Head, Link } from '@inertiajs/react';
import { Plus, Users, Search, ArrowLeft, Clock, Compass } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import GroupCard from '@/Components/Groups/GroupCard';
import CreateGroupModal from '@/Components/Modals/Groups/CreateGroup';
import { useState } from 'react';
import FlashToast from '../../Components/UI/FlashToast';

export default function GroupsIndex({ myGroups, pendingGroups, suggestedGroups }) {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('my-groups');

    const renderGroupGrid = (groups) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => <GroupCard key={group.id} group={group} />)}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#18181b] text-white">
            <Head title={t('community_title')} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-4">
                        <Link href={route('dashboard.index')} className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{t('groups_title')}</h1>
                            <p className="text-gray-400 text-sm hidden sm:block">{t('groups_subtitle')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20 text-sm"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">{t('groups_create_btn')}</span>
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {pendingGroups && pendingGroups.length > 0 && (
                    <div className="mb-10 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock size={18} className="text-yellow-400" />
                            <h2 className="text-lg font-bold uppercase tracking-wider text-yellow-400">
                                {t('groups_pending_requests') || "Pending Requests"}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {pendingGroups.map(group => (
                                <div key={group.id} className="relative">
                                    <div className="absolute -top-2.5 right-4 z-10 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider animate-pulse">
                                        {t('groups_status_pending') || "Pending"}
                                    </div>
                                    <GroupCard group={group} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex border-b border-white/10 mb-8">
                    <button
                        onClick={() => setActiveTab('my-groups')}
                        className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'my-groups' ? 'text-white border-b-2 border-[#FC4C02]' : 'text-gray-400 hover:text-white'} cursor-pointer`}
                    >
                        <Users size={16} /> {t('groups_tab_my_groups')}
                    </button>
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors ${activeTab === 'discover' ? 'text-white border-b-2 border-[#FC4C02]' : 'text-gray-400 hover:text-white'} cursor-pointer`}
                    >
                        <Compass size={16} /> {t('groups_tab_discover')}
                    </button>
                </div>

                {activeTab === 'my-groups' && (
                    <div className="animate-fade-in">
                        {myGroups.length > 0 ? (
                            renderGroupGrid(myGroups)
                        ) : (
                            <div className="bg-[#27272a] rounded-2xl p-12 text-center border border-white/10 border-dashed flex flex-col items-center">
                                <Users size={48} className="text-gray-600 mb-4" />
                                <h3 className="text-xl font-bold text-gray-300 mb-2">{t('groups_empty_state')}</h3>
                                <p className="text-gray-500 mb-6 max-w-sm">{t('groups_empty_state_desc')}</p>
                                <button onClick={() => setIsCreateModalOpen(true)} className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all text-sm">
                                    <Plus size={18} /> {t('groups_create_first')}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'discover' && (
                    <div className="animate-fade-in">
                        {suggestedGroups.length > 0 ? (
                            renderGroupGrid(suggestedGroups)
                        ) : (
                            <div className="bg-[#2727a] rounded-2xl p-12 text-center border border-white/10">
                                <Compass size={48} className="text-gray-600 mb-4 mx-auto" />
                                <h3 className="text-xl font-bold text-gray-300 mb-2">{t('groups_no_suggestions_title')}</h3>
                                <p className="text-gray-500">{t('groups_no_suggestions_desc')}</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <CreateGroupModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
            <FlashToast />
        </div>
    );
}