import { Users, Trophy } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import useTranslation from '@/Hooks/useTranslation';

export default function GroupCard({ group }) {
    const { t } = useTranslation();

    return (
        <Link
            href={route('groups.show', group.id)}
            className="group relative bg-[#27272a] rounded-3xl overflow-hidden border border-gray-800 hover:border-[#FC4C02] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 block"
        >
            <div className="h-32 w-full bg-gray-800 relative">
                {group.image_path ? (
                    <img src={`/storage/${group.image_path}`} alt={group.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-linear-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                        <Users size={48} className="text-gray-700" />
                    </div>
                )}

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold text-white border border-white/10">
                    <Users size={12} className="text-[#FC4C02]" />
                    {group.users_count || 0}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-[#FC4C02] transition-colors mb-2 line-clamp-1">
                    {group.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                    {group.description || t('groups_no_description')} {/* Traduzido */}
                </p>

                <div className="flex items-center justify-between border-t border-gray-700/50 pt-4 mt-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                        <Trophy size={14} className="text-yellow-500" />
                        <span>{group.challenges_count || 0} {t('groups_active_challenges')}</span> {/* Traduzido */}
                    </div>
                </div>
            </div>
        </Link>
    );
}