import { Timer, MapPin, TrendingUp, Medal } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function ChallengeCard({ auth, challenge, isPast = false }) {
    const { t, locale } = useTranslation();
    const currentUser = auth.user;

    const winner = isPast && challenge.leaderboard.length > 0 ? challenge.leaderboard[0] : null;

    const getIcon = () => {
        switch (challenge.type) {
            case 'total_time': return <Timer size={18} />;
            case 'max_elevation': return <TrendingUp size={18} />;
            default: return <MapPin size={18} />;
        }
    };

    const formatScore = (val) => {
        if (challenge.type === 'total_time') {
            const h = Math.floor(val / 3600);
            return `${h}h`;
        }
        if (challenge.type.includes('elevation')) return `${Math.round(val)}m`;
        return `${(val / 1000).toFixed(1)} km`;
    };

    const endDateFormatted = new Date(challenge.end_date).toLocaleDateString(locale);

    return (
        <div className={`rounded-3xl border overflow-hidden flex flex-col h-full ${isPast
            ? 'bg-[#18181b] border-gray-800'
            : 'bg-[#27272a] border-gray-700 shadow-xl'
            }`}>
            <div className={`p-6 border-b ${isPast ? 'bg-[#18181b] border-gray-800' : 'bg-[#202023] border-gray-700'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-[#FC4C02] text-xs font-bold uppercase tracking-wider">
                        {getIcon()}
                        <span>{t(`challenge_type_${challenge.type}`) || challenge.type.replace('_', ' ')}</span>
                    </div>

                    {isPast ? (
                        <span className="text-[10px] bg-gray-700 text-gray-300 border border-gray-600 px-2 py-1 rounded-full font-bold uppercase">
                            {t('status_ended')}
                        </span>
                    ) : (
                        <span className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded-full font-bold uppercase animate-pulse">
                            {t('challenge_running')}
                        </span>
                    )}
                </div>

                <h3 className={`text-lg font-bold mb-1 ${isPast ? 'text-gray-300' : 'text-white'}`}>
                    {challenge.name}
                </h3>

                <p className="text-xs text-gray-500">
                    {isPast ? t('challenge_ended_at') : t('challenge_ends_at')} {endDateFormatted}
                </p>

                {winner && isPast && (
                    <div className="mt-3 flex items-center gap-2 text-yellow-500 text-xs font-bold bg-yellow-500/10 px-3 py-2 rounded-lg border border-yellow-500/20">
                        <Medal size={14} />
                        <span>{t('winner_label')}: {winner.user.name}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 p-0 overflow-y-auto max-h-75 scrollbar-hide">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#18181b] text-[10px] uppercase text-gray-500 font-bold sticky top-0">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">{t('challenge_athlete')}</th>
                            <th className="px-4 py-2 text-right">{t('challenge_score')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {challenge.leaderboard.map((entry, index) => {
                            const isMe = entry.user.id === currentUser.id;
                            const rank = index + 1;

                            let rankColor = "text-gray-500";
                            if (rank === 1) rankColor = "text-yellow-500";
                            if (rank === 2) rankColor = "text-gray-300";
                            if (rank === 3) rankColor = "text-orange-700";

                            return (
                                <tr key={entry.user.id} className={`${isMe ? 'bg-[#FC4C02]/10' : 'hover:bg-white/5'} transition-colors`}>
                                    <td className="px-4 py-3">
                                        <div className={`font-bold font-mono ${rankColor} w-6 text-center`}>
                                            {rank <= 3 ? <Medal size={16} className="mx-auto" /> : rank}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                                                <img
                                                    src={entry.user.avatar || `https://ui-avatars.com/api/?name=${entry.user.name}&background=random`}
                                                    alt={entry.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className={`text-sm font-medium ${isMe ? 'text-[#FC4C02]' : 'text-gray-300'}`}>
                                                {isMe ? t('challenge_you') : entry.user.name.split(' ')[0]} {/* Traduzido "Tu" */}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="font-mono text-sm font-bold text-white">
                                            {formatScore(entry.score)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}

                        {challenge.leaderboard.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-8 text-gray-500 text-xs">
                                    {t('challenge_no_activities')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}