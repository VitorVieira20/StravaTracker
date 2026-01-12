import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Globe, LifeBuoy, LogOut, Settings, Trophy, Tv, User, Download, ExternalLink, Route, Calendar } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { route } from 'ziggy-js';

export default function SettingsIndex({ user, raceGoal }) {
    const { t } = useTranslation();
    const { locale } = usePage().props;

    const changeLanguage = (e) => {
        router.post(route('language.update'), { locale: e.target.value }, {
            preserveScroll: true
        });
    };

    const toggleTvMode = () => {
        router.post(route('profile.update'), {
            tv_mode: !user.tv_mode
        }, {
            preserveScroll: true,
        });
    };

    const SettingsCard = ({ title, icon: Icon, children, className = "" }) => (
        <div className={`bg-[#27272a] rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col h-full ${className}`}>
            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                <div className="p-2 rounded-xl bg-gray-800 text-[#FC4C02]">
                    <Icon size={20} />
                </div>
                <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>
            <div className="flex-1 flex flex-col gap-4">
                {children}
            </div>
        </div>
    );

    const ToggleRow = ({ label, desc, checked, onChange }) => (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-gray-200">{label}</p>
                {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
            </div>
            <button
                onClick={onChange}
                className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-[#FC4C02]' : 'bg-gray-700'} cursor-pointer`}
            >
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`} />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#18181b] text-white p-4 md:p-8 font-sans">
            <Head title={t('set_title')} />

            <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
                <Link
                    href={route('dashboard.index')}
                    className="p-3 rounded-full hover:bg-gray-800 text-gray-400 transition"
                >
                    <ArrowLeft size={22} />
                </Link>

                <div>
                    <h1 className="text-3xl font-bold">{t('set_title')}</h1>
                    <p className="text-gray-400 text-sm">{t('set_subtitle')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SettingsCard title={t('set_profile')} icon={User}>
                    <div className="bg-[#18181b] rounded-2xl p-4 border border-gray-700 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-[#FC4C02] flex items-center justify-center text-xl font-bold uppercase">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold">{user.name}</h3>
                            <span className="text-xs text-green-500 font-bold uppercase">
                                {t('lbl_connected')}
                            </span>
                        </div>
                    </div>
                </SettingsCard>

                <SettingsCard title={t('set_goal')} icon={Trophy}>
                    <div className="bg-[#18181b] p-4 rounded-2xl border border-gray-700">
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                            {t('lbl_current_goal')}
                        </p>

                        <p className="text-xl font-bold mb-3">
                            {raceGoal ? raceGoal.name : t('lbl_no_goal')}
                        </p>

                        {raceGoal && (
                            <div className="flex gap-4 pt-3 border-t border-gray-700/50 text-sm">
                                <div className="flex items-center gap-1 text-gray-300">
                                    <Route size={14} className="text-[#FC4C02]" />
                                    <span className="font-mono font-bold">
                                        {raceGoal.distance} km
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400">
                                    <Calendar size={14} />
                                    {raceGoal.date}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        href={route('goals.edit')}
                        className="mt-auto w-full bg-[#FC4C02] hover:bg-[#e34402] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
                    >
                        <Trophy size={16} /> {t('btn_edit_goal')}
                    </Link>
                </SettingsCard>

                <SettingsCard
                    title={t('set_tv_mode')}
                    icon={Tv}
                    className="border-[#FC4C02]/30"
                >
                    <p className="text-gray-400 text-sm">
                        {t('desc_tv_mode')}
                    </p>

                    <div className="bg-[#18181b] p-4 rounded-2xl border border-gray-700">
                        <ToggleRow
                            label={t('lbl_tv_mode_active')}
                            checked={user.tv_mode}
                            onChange={toggleTvMode}
                        />
                    </div>
                </SettingsCard>

                <SettingsCard title={t('set_prefs')} icon={Settings}>
                    <label className="text-xs font-bold text-gray-500 uppercase">
                        {t('lbl_lang')}
                    </label>

                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-4 text-gray-500" />
                        <select
                            value={locale}
                            onChange={changeLanguage}
                            className="w-full bg-[#18181b] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#FC4C02] cursor-pointer"
                        >
                            <option value="pt">🇵🇹 Português</option>
                            <option value="en">🇬🇧 English</option>
                            <option value="es">🇪🇸 Español</option>
                            <option value="fr">🇫🇷 Français</option>
                            <option value="it">🇮🇹 Italiano</option>
                        </select>
                    </div>
                </SettingsCard>

                <SettingsCard title={t('set_support')} icon={LifeBuoy}>
                    <Link
                        href={route('support.create')}
                        className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition text-sm"
                    >
                        <div className="flex items-center gap-3">
                            <LifeBuoy size={18} className="text-blue-400" />
                            {t('btn_contact_support')}
                        </div>
                        <ExternalLink size={14} />
                    </Link>
                </SettingsCard>

                <SettingsCard title={t('set_data')} icon={Download}>
                    <p className="text-gray-400 text-sm">
                        {t('desc_data')}
                    </p>

                    <a
                        href={route('settings.export')}
                        target="_blank"
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors text-sm mb-3 flex items-center justify-center gap-2"
                    >
                        <Download size={16} /> {t('btn_export')}
                    </a>
                </SettingsCard>

            </div>
        </div>
    );
}
