import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Ban, CreditCard, Lock, MapPinOff, ServerCrash, ShieldAlert } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function ErrorPage({ status, translations }) {
    const { t } = useTranslation();

    const errorMap = {
        401: {
            title: 'error_401_title',
            desc: 'error_401_desc',
            icon: <Lock size={64} className="text-gray-600 mb-6" />,
        },
        402: {
            title: 'error_402_title',
            desc: 'error_402_desc',
            icon: <CreditCard size={64} className="text-[#FC4C02] mb-6" />,
        },
        403: {
            title: 'error_403_title',
            desc: 'error_403_desc',
            icon: <ShieldAlert size={64} className="text-yellow-500 mb-6" />,
        },
        404: {
            title: 'error_404_title',
            desc: 'error_404_desc',
            icon: <MapPinOff size={64} className="text-gray-500 mb-6" />,
        },
        405: {
            title: 'error_405_title',
            desc: 'error_405_desc',
            icon: <Ban size={64} className="text-red-400 mb-6" />,
        },
        500: {
            title: 'error_500_title',
            desc: 'error_500_desc',
            icon: <ServerCrash size={64} className="text-red-600 mb-6" />,
        },
    };

    const error = errorMap[status] || {
        title: 'error_generic_title',
        desc: 'error_generic_desc',
        icon: <ServerCrash size={64} className="text-gray-500 mb-6" />,
    };

    return (
        <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center p-6 text-white text-center font-sans">
            <Head title={status ? `${status} Error` : 'Error'} />

            <div className="bg-[#27272a] p-10 md:p-16 rounded-3xl border border-gray-800 shadow-2xl max-w-lg w-full flex flex-col items-center animate-fade-in">

                <div className="bg-[#18181b] p-6 rounded-full border border-gray-700 mb-6 shadow-inner">
                    {error.icon}
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-gray-600 tracking-tighter mb-4">
                    {status}
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {t(error.title)}
                </h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    {t(error.desc)}
                </p>

                <Link
                    href="/"
                    className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-orange-900/20"
                >
                    <ArrowLeft size={20} />
                    {t('btn_back_home')}
                </Link>
            </div>

            <footer className="mt-12 text-gray-600 text-xs">
                Run Tracker &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
}