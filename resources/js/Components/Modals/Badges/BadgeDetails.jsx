import { useEffect } from 'react';
import { X, Calendar, Trophy, Lock, Info, BarChart3 } from 'lucide-react'; // <--- Adicionei BarChart3
import useTranslation from '@/Hooks/useTranslation';
import BadgeIcon from '../../Badges/BadgeIcon';

export default function BadgeDetailsModal({ badge, onClose, userBadgePivot }) {
    const { t } = useTranslation();

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!badge) return null;

    const isUnlocked = !!userBadgePivot;

    const tierGlows = {
        bronze: "from-orange-500/20 to-orange-900/5",
        silver: "from-slate-400/20 to-slate-800/5",
        gold: "from-yellow-500/20 to-yellow-900/5",
        platinum: "from-blue-600/20 to-blue-900/5",
    };

    const glowColor = tierGlows[badge.tier] || tierGlows.bronze;

    const formattedDate = userBadgePivot?.awarded_at
        ? new Intl.DateTimeFormat(document.documentElement.lang, {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(new Date(userBadgePivot.awarded_at))
        : null;

    const formatValue = (val, unit) => {
        if (!val) return 0;
        if (unit === 'km') return (val / 1000).toFixed(1);

        if (unit === 'min') {
            if (val >= 60) return (val / 60).toFixed(1) + 'h';
            return Math.round(val) + 'm';
        }
        return Math.round(val);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-[#18181b] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className={`absolute inset-0 bg-linear-to-b ${glowColor} pointer-events-none`} />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-white/10 rounded-full text-white transition-colors z-20 cursor-pointer"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10 flex flex-col items-center p-8 text-center">
                    <div className="mb-6 transform transition-transform hover:scale-105 duration-500">
                        <div className={!isUnlocked ? "opacity-50 grayscale" : "drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]"}>
                            <div style={{ width: '180px', height: '180px' }}>
                                <BadgeIcon badge={badge} size="custom" locked={false} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {t(`badge_${badge.identifier}`) || badge.identifier}
                    </h2>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border ${isUnlocked ? 'border-white/20 text-white/80 bg-white/5' : 'border-gray-700 text-gray-500'
                        }`}>
                        {badge.tier}
                    </span>

                    <p className="text-gray-300 text-sm leading-relaxed max-w-[80%] mb-8">
                        {t(`badge_desc_${badge.identifier}`) || "Completa o desafio para desbloquear esta medalha."}
                    </p>

                    <div className="w-full bg-black/20 rounded-2xl p-4 border border-white/5 grid grid-cols-1 gap-4">
                        {!isUnlocked && badge.progress ? (
                            <div className="mb-2 w-full">
                                <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                                    <span className="flex items-center gap-1"><BarChart3 size={12} /> {t('badge_progress')}</span>
                                    <span>{badge.progress.percentage}%</span>
                                </div>

                                <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-[#FC4C02] transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(252,76,2,0.5)]"
                                        style={{ width: `${badge.progress.percentage}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between text-xs font-mono text-gray-500">
                                    <span>{formatValue(badge.progress.current, badge.progress.unit)} {badge.progress.unit !== 'min' ? badge.progress.unit : ''}</span>
                                    <span>{formatValue(badge.progress.target, badge.progress.unit)} {badge.progress.unit !== 'min' ? badge.progress.unit : ''}</span>
                                </div>
                            </div>
                        ) : null}

                        {isUnlocked ? (
                            <div className="flex items-center justify-center gap-3 text-[#FC4C02]">
                                <Trophy size={18} />
                                <span className="font-bold text-sm">{t('badge_status_unlocked') || "CONQUISTADO"}</span>
                            </div>
                        ) : (
                            !badge.progress && (
                                <div className="flex items-center justify-center gap-3 text-gray-500">
                                    <Lock size={18} />
                                    <span className="font-bold text-sm">{t('badge_status_locked') || "BLOQUEADO"}</span>
                                </div>
                            )
                        )}

                        {isUnlocked && formattedDate && (
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 border-t border-white/5 pt-3 mt-2">
                                <Calendar size={14} />
                                <span>{formattedDate}</span>
                            </div>
                        )}

                        {!isUnlocked && !badge.progress && (
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 border-t border-white/5 pt-3 mt-2">
                                <Info size={14} />
                                <span>{t('badge_locked_message') || "Continua a treinar para desbloquear!"}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}