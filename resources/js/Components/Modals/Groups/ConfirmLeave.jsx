import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmLeaveModal({ isOpen, onClose, onConfirm, processing, t }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-[#18181b] w-full max-w-lg rounded-3xl border border-gray-800 p-8 relative z-10 shadow-2xl animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer transition-colors">
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <AlertTriangle size={32} />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">{t('btn_leave_group')}?</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t('groups_leave_confirm')}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        {t('groups_cancel')}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-red-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? '...' : t('btn_leave_group')}
                    </button>
                </div>
            </div>
        </div>
    );
}