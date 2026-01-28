import { Users, Trophy, Lock, Globe, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import useTranslation from '@/Hooks/useTranslation';

export default function GroupCard({ group }) {
    const { t } = useTranslation();

    return (
        <Link
            href={route('groups.show', group.id)}
            className="group relative bg-[#27272a] rounded-2xl overflow-hidden border border-transparent hover:border-[#FC4C02] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 block"
        >
            <div className="h-36 w-full bg-gray-800 relative">
                {group.image_path ? (
                    <img src={`/storage/${group.image_path}`} alt={group.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <Users size={48} className="text-gray-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-3 left-3">
                    <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold text-white border border-white/10">
                        {group.privacy === 'private' ? (
                            <Lock size={12} className="text-yellow-400" />
                        ) : (
                            <Globe size={12} className="text-blue-400" />
                        )}
                        <span className="text-[11px] uppercase tracking-wider">{t(`groups_privacy_${group.privacy}_title`)}</span>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FC4C02] transition-colors line-clamp-2 leading-tight shadow-black" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                        {group.name}
                    </h3>
                </div>
            </div>

            <div className="p-5">
                <p className="text-gray-400 text-sm line-clamp-2 mb-5 h-10">
                    {group.description || t('groups_no_description')}
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300 font-semibold">
                            <Users size={16} className="text-[#FC4C02]" />
                            <span>{group.users_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 font-semibold">
                            <Trophy size={16} className="text-yellow-500" />
                            <span>{group.challenges_count || 0}</span>
                        </div>
                    </div>
                    
                    <div className="text-gray-500 group-hover:text-[#FC4C02] group-hover:translate-x-1 transition-transform duration-300">
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
        </Link>
    );
}