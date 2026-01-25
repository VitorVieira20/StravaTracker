import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Search, Activity, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';
import { route } from 'ziggy-js';
import ActivityModal from '../../Components/Modals/Activities/ActivityDetails';
import ActivityCard from '../../Components/Activities/ActivityCard';
import ActivityFilters from '../../Components/Activities/ActivityFilters';
import ExportActivitiesModal from '../../Components/Modals/Activities/ExportActivitiesModal';

export default function ActivitiesIndex({ activities, filters }) {
    const safeFilters = (Array.isArray(filters) || !filters) ? {} : filters;

    const { t } = useTranslation();

    const [search, setSearch] = useState(safeFilters.search || '');
    const [sort, setSort] = useState(safeFilters.sort || 'date_desc');
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('activities.index'), {
                search: search,
                sort: sort,
                page: 1
            }, { preserveState: true });
        }
    };

    const getPageLabel = (label) => {
        if (label.includes('previous') || label.includes('&laquo;')) {
            return <ChevronLeft size={20} />;
        }
        if (label.includes('next') || label.includes('&raquo;')) {
            return <ChevronRight size={20} />;
        }
        return <span dangerouslySetInnerHTML={{ __html: label }} />;
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        router.get(route('activities.index'), {
            search: search,
            sort: newSort,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const list = activities.data || activities;
    const links = activities.links || [];

    return (
        <div className="min-h-screen bg-[#18181b] text-white p-4 md:p-8 font-sans">
            <Head title={t('act_title') || "Atividades"} />

            {selectedActivity && (
                <ActivityModal
                    activity={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                />
            )}

            {isExportModalOpen && (
                <ExportActivitiesModal
                    onClose={() => setIsExportModalOpen(false)}
                    filters={{ search, sort }}
                />
            )}

            <div className="max-w-7xl mx-auto mb-8 flex flex-col lg:flex-row md:items-center justify-between gap-6">

                <div className="flex items-center gap-4">
                    <Link href={route('dashboard.index')} className="p-3 rounded-full hover:bg-gray-800 text-gray-400 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{t('act_title') || "Histórico de Treinos"}</h1>
                        <p className="text-gray-400 text-sm">
                            {t('act_subtitle') || "corridas sincronizadas."}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="flex gap-4">
                         <div className="w-full md:w-auto z-20">
                            <ActivityFilters currentSort={sort} onSortChange={handleSortChange} />
                        </div>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="bg-[#27272a] hover:bg-[#323236] text-white p-3 rounded-xl border border-gray-700 transition-colors flex items-center justify-center cursor-pointer"
                            title={t('export_btn') || "Exportar"}
                        >
                            <Download size={20} />
                        </button>
                    </div>

                    <div className="relative w-full md:w-80 z-10">
                        <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder={t('act_search_ph')}
                            className="w-full bg-[#27272a] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#FC4C02] focus:ring-0 placeholder-gray-500 transition-all focus:bg-[#323236]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto">

                {list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-[#27272a] rounded-[3rem] border border-gray-800 border-dashed">
                        <div className="bg-gray-800 p-6 rounded-full mb-6 animate-pulse">
                            <Activity size={48} className="text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{t('act_empty_title') || "Sem atividades encontradas"}</h3>
                        <p className="text-gray-400 text-base mb-8">{t('act_empty_desc') || "Tenta ajustar a pesquisa ou sincroniza novos dados."}</p>
                        <Link href={route('dashboard.index', { refresh: true })} className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-orange-900/20">
                            {t('act_sync_btn') || "Sincronizar Agora"}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {list.map((run) => (
                            <ActivityCard key={run.id} run={run} setSelectedActivity={setSelectedActivity} />
                        ))}
                    </div>
                )}

                {links.length > 3 && (
                    <div className="flex flex-wrap justify-center mt-12 gap-2 pb-12">
                        {links.map((link, i) => (
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`min-w-10 h-10 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center mb-2
                        ${link.active
                                            ? 'bg-[#FC4C02] text-white shadow-lg shadow-orange-900/30 scale-105'
                                            : 'bg-[#27272a] text-gray-400 hover:text-white hover:bg-gray-700'}
                    `}
                                >
                                    {getPageLabel(link.label)}
                                </Link>
                            ) : (
                                <span
                                    key={i}
                                    className="min-w-10 h-10 px-3 rounded-xl text-sm text-gray-600 bg-[#27272a]/50 cursor-not-allowed opacity-50 flex items-center justify-center mb-2"
                                >
                                    {getPageLabel(link.label)}
                                </span>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}