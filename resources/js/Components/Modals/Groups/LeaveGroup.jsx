import { useForm } from '@inertiajs/react';
import { X, Crown, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function LeaveGroupModal({ isOpen, onClose, group, users, t }) {
    const [selectedUserId, setSelectedUserId] = useState(null);

    const { delete: destroy, processing } = useForm({
        new_admin_id: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        destroy(route('groups.leave', group.id), {
            data: { new_admin_id: selectedUserId },
            onSuccess: () => onClose(),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-[#18181b] w-full max-w-lg rounded-3xl border border-gray-800 p-8 relative z-10 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 text-yellow-500">
                        <Crown size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('groups_leave_promote_title')}</h2>
                    <p className="text-gray-400 text-sm mt-2">
                        {t('groups_leave_promote_desc')}
                    </p>
                </div>

                <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-2 custom-scrollbar">
                    {users.map(user => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUserId(user.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedUserId === user.id
                                    ? 'bg-[#FC4C02]/10 border-[#FC4C02]'
                                    : 'bg-[#27272a] border-gray-800 hover:border-gray-600'
                                }`}
                        >
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1 text-left">
                                <p className={`font-bold ${selectedUserId === user.id ? 'text-[#FC4C02]' : 'text-white'}`}>
                                    {user.name}
                                </p>
                            </div>
                            {selectedUserId === user.id && <Crown size={16} className="text-[#FC4C02]" />}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-semibold hover:bg-white/5 transition-colors cursor-pointer">
                        {t('btn_cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedUserId || processing}
                        className={`flex-1 py-3 rounded-xl font-semibold shadow-lg transition-all ${!selectedUserId || processing
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-[#FC4C02] hover:bg-[#e34402] text-white shadow-orange-900/20'
                            } cursor-pointer`}
                    >
                        {t('btn_promote_and_leave')}
                    </button>
                </div>
            </div>
        </div>
    );
}