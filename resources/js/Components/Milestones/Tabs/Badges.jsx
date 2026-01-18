import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import { Lock } from 'lucide-react';
import BadgeIcon from '../../Badges/BadgeIcon';
import BadgeDetailsModal from '../../Modals/Badges/BadgeDetails';

export default function BadgesTab({ allBadges, userBadges }) {
    const { t } = useTranslation();
    const [selectedBadge, setSelectedBadge] = useState(null);

    const unlockedMap = new Map();
    userBadges.forEach(b => unlockedMap.set(b.id, b.pivot));

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {allBadges.map((badge) => {
                    const pivotData = unlockedMap.get(badge.id);
                    const isUnlocked = !!pivotData;

                    return (
                        <div 
                            key={badge.id} 
                            onClick={() => setSelectedBadge({ badge, pivot: pivotData })} // <--- Abrir Modal
                            className="flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-1"
                        >
                            <div className="relative mb-3 transition-transform duration-300 group-hover:scale-110">
                                <BadgeIcon badge={badge} size="lg" locked={!isUnlocked} />
                                {!isUnlocked && (
                                    <div className="absolute -bottom-2 right-0 bg-gray-800 p-1.5 rounded-full border border-gray-600 shadow-md">
                                        <Lock size={12} className="text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <h3 className={`font-bold text-center text-sm ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                                {t(`badge_${badge.identifier}`) || badge.identifier}
                            </h3>

                            {isUnlocked ? (
                                <span className="text-[10px] text-[#FC4C02] font-bold uppercase tracking-wider mt-1">
                                    Desbloqueado
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-600 mt-1">
                                    Bloqueado
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <BadgeDetailsModal
                badge={selectedBadge?.badge} 
                userBadgePivot={selectedBadge?.pivot}
                onClose={() => setSelectedBadge(null)} 
            />
        </div>
    );
}