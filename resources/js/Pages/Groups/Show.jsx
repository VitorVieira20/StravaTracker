import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState } from 'react';
import CreateChallengeModal from '../../Components/Groups/CreateChallenge';
import FlashToast from '../../Components/UI/FlashToast';
import MembersTab from '../../Components/Groups/MembersTab';
import ChallengesTab from '../../Components/Groups/ChallengesTab';
import LeaveGroupModal from '../../Components/Modals/Groups/LeaveGroup';
import ConfirmLeaveModal from '../../Components/Modals/Groups/ConfirmLeave';

export default function GroupShow({ auth, group, challenges, pastChallenges, hallOfFame, membership, authManagedGroups }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('challenges');
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const { post, delete: destroy, processing } = useForm();

    const activeUsers = group.users.filter(u => u.pivot.status === 'active');

    const handleJoin = () => post(route('groups.join', group.id));
    const handleLeave = () => destroy(route('groups.leave', group.id));

    const handleLeaveClick = () => {
        const myId = auth.user.id;
        const isAdmin = membership.is_admin;

        const adminCount = activeUsers.filter(u => u.pivot.role === 'admin').length;
        const memberCount = activeUsers.length;

        if (isAdmin && adminCount === 1 && memberCount > 1) {
            setIsLeaveModalOpen(true);
        } else {
            setIsConfirmModalOpen(true);
        }
    };

    const handleConfirmLeave = () => {
        destroy(route('groups.leave', group.id), {
            onSuccess: () => setIsConfirmModalOpen(false),
            onError: () => setIsConfirmModalOpen(false),
        });
    };


    return (
        <div className="min-h-screen bg-[#18181b] text-white">
            <Head title={group.name} />

            <div className="relative h-92 md:h-80 bg-gray-900 overflow-hidden w-full group-banner">

                <div className="absolute inset-0 z-0">
                    {group.image_path ? (
                        <img
                            src={`/storage/${group.image_path}`}
                            className="w-full h-full object-cover opacity-60"
                            alt="Capa do grupo"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-b from-gray-800 to-[#18181b]" />
                    )}
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-[#18181b] via-transparent to-black/30 z-0 pointer-events-none" />

                <div className="absolute top-6 left-6 md:left-12 z-20">
                    <Link href={route('groups.index')} className="bg-black/30 backdrop-blur p-3 rounded-full hover:bg-white/10 text-white transition-colors block">
                        <ArrowLeft size={24} />
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="w-full">
                            <span className="bg-[#FC4C02] text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">
                                {t('group_label')}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight break-words">
                                {group.name}
                            </h1>

                            <div className="max-w-2xl">
                                <p
                                    className={`text-gray-300 wrap-break-word whitespace-pre-line transition-all duration-300 ${isDescriptionExpanded ? '' : 'line-clamp-2 md:line-clamp-3'
                                        }`}
                                >
                                    {group.description}
                                </p>

                                {group.description && group.description.length > 100 && (
                                    <button
                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        className="text-[#FC4C02] text-xs font-bold mt-2 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        {isDescriptionExpanded ? (
                                            <>{t('btn_show_less') || 'Show Less'} <ChevronUp size={12} /></>
                                        ) : (
                                            <>{t('btn_read_more') || 'Read More'} <ChevronDown size={12} /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 pb-1">
                            <div className="flex -space-x-3">
                                {activeUsers.slice(0, 5).map(u => (
                                    <div key={u.id} className="w-10 h-10 rounded-full border-2 border-[#18181b] bg-gray-700 overflow-hidden">
                                        <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {activeUsers.length > 5 && (
                                    <div className="w-10 h-10 rounded-full border-2 border-[#18181b] bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                        +{group.users.length - 5}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row p-2 items-center justify-center">
                <div className="flex gap-3 mt-4">
                    {!membership.is_member && !membership.is_pending && (
                        <button
                            onClick={handleJoin}
                            className="bg-[#FC4C02] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#e34402] transition cursor-pointer"
                        >
                            {group.privacy === 'private' ? t('btn_request_join') : t('btn_join_group')}
                        </button>
                    )}

                    {membership.is_pending && (
                        <div className="flex items-center gap-3">
                            <span className="text-yellow-500 font-semibold bg-yellow-500/10 px-3 py-2 rounded-lg">
                                {t('status_pending_approval')}
                            </span>
                            <button onClick={handleLeave} className="text-gray-400 hover:text-white underline text-md cursor-pointer">
                                {t('btn_cancel_request')}
                            </button>
                        </div>
                    )}

                    {membership.is_member && (
                        <button
                            onClick={handleLeaveClick}
                            className="border border-gray-600 text-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-white/10 hover:text-white transition text-sm cursor-pointer"
                        >
                            {t('btn_leave_group')}
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12">
                <div className="flex gap-6 border-b border-gray-800 mb-8">
                    <button
                        onClick={() => setActiveTab('challenges')}
                        className={`pb-4 font-semibold text-sm uppercase tracking-widest transition-colors ${activeTab === 'challenges' ? 'text-[#FC4C02] border-b-2 border-[#FC4C02]' : 'text-gray-500 hover:text-white'} cursor-pointer`}
                    >
                        {t('tab_challenges')}
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`pb-4 font-semibold text-sm uppercase tracking-widest transition-colors ${activeTab === 'members' ? 'text-[#FC4C02] border-b-2 border-[#FC4C02]' : 'text-gray-500 hover:text-white'} cursor-pointer`}
                    >
                        {t('tab_members')}
                    </button>
                </div>

                {activeTab === 'challenges' && (
                    <ChallengesTab auth={auth} t={t} challenges={challenges} pastChallenges={pastChallenges} hallOfFame={hallOfFame} membership={membership} setIsChallengeModalOpen={setIsChallengeModalOpen} />
                )}

                {activeTab === 'members' && (
                    <MembersTab auth={auth} t={t} group={group} membership={membership} authManagedGroups={authManagedGroups} />
                )}

            </div>

            <CreateChallengeModal
                isOpen={isChallengeModalOpen}
                onClose={() => setIsChallengeModalOpen(false)}
                groupId={group.id}
            />

            <LeaveGroupModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                group={group}
                users={activeUsers.filter(u => u.id !== auth.user.id)}
                t={t}
            />

            <ConfirmLeaveModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmLeave}
                processing={processing}
                t={t}
            />

            <FlashToast />
        </div>
    );
}