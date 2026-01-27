import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function FlashToast() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        }
        else if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }

        const timer = setTimeout(() => {
            setVisible(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, [flash]);

    if (!visible) return null;

    return (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
            <div className={`
                flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md
                min-w-75 max-w-md transition-all duration-300
                ${type === 'success'
                    ? 'bg-[#18181b]/90 border-green-500/30 text-white'
                    : 'bg-[#18181b]/90 border-red-500/30 text-white'}
            `}>
                <div className="shrink-0">
                    {type === 'success' ? (
                        <CheckCircle className="text-green-500" size={24} />
                    ) : (
                        <XCircle className="text-red-500" size={24} />
                    )}
                </div>

                <div className="flex-1">
                    <p className="text-sm text-gray-300 leading-tight">
                        {message}
                    </p>
                </div>

                <button
                    onClick={() => setVisible(false)}
                    className="shrink-0 text-gray-500 hover:text-white transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}