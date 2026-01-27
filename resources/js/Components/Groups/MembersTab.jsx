import { router } from "@inertiajs/react";
import { Calendar, Crown, Search, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";
import KickMemberModal from "../Modals/Groups/KickMember";

export default function MembersTab({ auth, t, group, membership }) {
    const [memberSearch, setMemberSearch] = useState("");
    const [userToKick, setUserToKick] = useState(null);
    const [isKickModalOpen, setIsKickModalOpen] = useState(false);
    const [processingKick, setProcessingKick] = useState(false);


    const pendingUsers = group.users.filter(u => u.pivot.status === 'pending');
    const activeUsers = group.users.filter(u => u.pivot.status === 'active');

    const handleApprove = (userId) => {
        router.post(route('groups.members.approve', [group.id, userId]));
    };

    const handleReject = (userId) => {
        router.delete(route('groups.members.remove', [group.id, userId]));
    };

    const openKickModal = (user) => {
        setUserToKick(user);
        setIsKickModalOpen(true);
    };

    // NOVA: Função para confirmar a expulsão
    const handleConfirmKick = () => {
        if (!userToKick) return;
        setProcessingKick(true);

        router.delete(route('groups.members.remove', [group.id, userToKick.id]), {
            onSuccess: () => {
                setIsKickModalOpen(false);
                setUserToKick(null);
                setProcessingKick(false);
            },
            onError: () => {
                setProcessingKick(false);
            }
        });
    };

    return (
        <div className="animate-fade-in">
            {membership.is_admin && pendingUsers.length > 0 && (
                <div className="mb-10 p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                    <h3 className="text-yellow-500 font-bold uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                        {t('groups_waitlist_label')} ({pendingUsers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between bg-[#18181b] p-3 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <span className="font-bold">{user.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApprove(user.id)} className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition cursor-pointer" title={t('groups_btn_accept')}>
                                        {t('groups_btn_accept')}
                                    </button>
                                    <button onClick={() => handleReject(user.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer" title={t('groups_btn_reject')}>
                                        {t('groups_btn_reject')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder={t('members_search_placeholder')}
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="w-full bg-[#27272a] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-[#FC4C02] focus:border-transparent outline-none transition-all placeholder-gray-600"
                    />
                </div>
                <p className="text-sm text-gray-400 font-medium">
                    {activeUsers.filter(u => u.name.toLowerCase().includes(memberSearch.toLowerCase())).length} {t('members_count_label')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {activeUsers
                    .filter(user => user.name.toLowerCase().includes(memberSearch.toLowerCase()))
                    .sort((a, b) => (a.pivot.role === 'admin' ? -1 : 1))
                    .map(user => {
                        const isAdmin = user.pivot.role === 'admin';
                        const isMe = user.id === auth.user.id;
                        const isOwner = group.owner_id === user.id;

                        // Só posso expulsar se:
                        // 1. Eu for Admin
                        // 2. O alvo não for eu mesmo
                        // 3. O alvo não for o Dono do grupo
                        const canKick = membership.is_admin && !isMe && !isOwner;

                        return (
                            <div
                                key={user.id}
                                className={`
                                group relative p-4 rounded-xl border transition-all duration-300
                                ${isAdmin
                                        ? 'bg-linear-to-br from-[#27272a] to-[#27272a]/50 border-orange-500/20 hover:border-orange-500/40'
                                        : 'bg-[#27272a] border-gray-800 hover:border-gray-600 hover:bg-[#3f3f46]/30'
                                    }
                            `}
                            >
                                {canKick && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openKickModal(user);
                                        }}
                                        className="absolute top-1 right-1 text-red-500 hover:text-red-600 transition-colors p-1 z-10 
                                                opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100 
                                                bg-[#27272a]/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none rounded-full cursor-pointer"
                                        title={t('groups_btn_kick')}
                                    >
                                        <Trash2 size={18} /> 
                                    </button>
                                )}

                                {isAdmin && !canKick && (
                                    <div className="absolute top-3 right-3 text-[#FC4C02]" title={t('members_role_admin')}>
                                        <Crown size={16} fill="currentColor" className="opacity-80" />
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className={`relative w-12 h-12 rounded-full overflow-hidden shrink-0 ${isAdmin ? 'ring-2 ring-[#FC4C02] ring-offset-2 ring-offset-[#18181b]' : 'bg-gray-700'}`}>
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white truncate text-sm md:text-base">
                                            {user.name}
                                        </p>

                                        <div className="flex items-center gap-2 mt-0.5">
                                            {isAdmin ? (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-[#FC4C02] uppercase tracking-wider bg-[#FC4C02]/10 px-1.5 py-0.5 rounded-sm">
                                                    <Shield size={10} /> {t('members_role_admin')}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800 px-1.5 py-0.5 rounded-sm">
                                                    {t('members_role_member')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {user.pivot.created_at && (
                                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        <span>
                                            {t('members_joined_date')} {new Date(user.pivot.created_at).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>

            {activeUsers.filter(u => u.name.toLowerCase().includes(memberSearch.toLowerCase())).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <Search size={32} className="mx-auto mb-3 opacity-20" />
                    <p>{t('members_empty_state')}</p>
                </div>
            )}

            <KickMemberModal
                isOpen={isKickModalOpen}
                onClose={() => setIsKickModalOpen(false)}
                onConfirm={handleConfirmKick}
                user={userToKick}
                processing={processingKick}
                t={t}
            />
        </div>
    );
}