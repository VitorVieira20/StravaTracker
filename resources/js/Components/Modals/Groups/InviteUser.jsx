import { useForm } from '@inertiajs/react';
import { X, Send, Users } from 'lucide-react';
import { route } from 'ziggy-js';

export default function InviteMemberToMyGroupModal({ isOpen, onClose, targetUser, myAdminGroups, t }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        group_id: '',
        user_id: targetUser?.id
    });

    if (targetUser?.id && data.user_id !== targetUser.id) {
        setData('user_id', targetUser.id);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.group_id) return;

        post(route('groups.invite', data.group_id), {
            onSuccess: () => {
                reset();
                onClose();
            },
            preserveScroll: true
        });
    };

    if (!isOpen || !targetUser) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-[#18181b] w-full max-w-md rounded-3xl border border-gray-800 p-8 relative z-10 animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"><X size={24} /></button>

                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                    <Users className="text-[#FC4C02]" /> {t('invite_to_another_group_title')}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                    {t('invite_to_another_group_desc')} {" "} {targetUser.name}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                            {t('select_group_label')}
                        </label>

                        {myAdminGroups.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {myAdminGroups.map(group => (
                                    <label
                                        key={group.id}
                                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${data.group_id == group.id
                                                ? 'bg-[#FC4C02]/20 border-[#FC4C02] text-white'
                                                : 'bg-[#27272a] border-gray-700 text-gray-300 hover:bg-[#27272a]/80'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="group_selection"
                                            value={group.id}
                                            checked={data.group_id == group.id}
                                            onChange={(e) => setData('group_id', e.target.value)}
                                            className="hidden"
                                        />
                                        <span className="font-semibold text-sm">{group.name}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm italic p-4 text-center border border-gray-800 rounded-xl">
                                {t('no_admin_groups_found')}
                            </div>
                        )}

                        {errors.group_id && <div className="text-red-500 text-xs mt-1">{errors.group_id}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !data.group_id}
                        className="w-full bg-[#FC4C02] hover:bg-[#e34402] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? '...' : <><Send size={18} /> {t('btn_send_invite')}</>}
                    </button>
                </form>
            </div>
        </div>
    );
}