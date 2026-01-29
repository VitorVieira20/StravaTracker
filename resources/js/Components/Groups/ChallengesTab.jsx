import { Crown, Filter, History, PlayCircle, Plus, Search, Trophy, X } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import ChallengeCard from "./ChallengeCard";
import Pagination from "@/Components/UI/Pagination";

export default function ChallengesTab({ auth, t, challenges, pastChallenges, hallOfFame, membership, setIsChallengeModalOpen }) {
    const [subTab, setSubTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const topRef = useRef(null);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleTabChange = (tab) => {
        setSubTab(tab);
        setCurrentPage(1);
        setSearchQuery("");
        setTypeFilter("all");
    };

    const currentList = subTab === 'active' ? challenges : pastChallenges;

    const filteredList = useMemo(() => {
        return currentList.filter(challenge => {
            const matchesSearch = challenge.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter === 'all' || challenge.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [currentList, searchQuery, typeFilter]);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const paginatedItems = filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="animate-fade-in" ref={topRef}>
            {hallOfFame && hallOfFame.length > 0 && (
                <div className="mb-10 bg-linear-to-r from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Crown size={80} className="text-yellow-500" />
                    </div>
                    <h3 className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-sm mb-4">
                        <Trophy size={16} /> {t('hall_of_fame_title')}
                    </h3>
                    <div className="flex flex-wrap gap-6">
                        {hallOfFame.map((entry, index) => (
                            <div key={entry.user.id} className="flex items-center gap-3">
                                <div className="relative">
                                    <img 
                                        src={entry.user.avatar || `https://ui-avatars.com/api/?name=${entry.user.name}&background=random`} 
                                        className={`w-12 h-12 rounded-full border-2 ${index === 0 ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-gray-700'}`}
                                    />
                                    {index === 0 && (
                                        <div className="absolute -top-2 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded-full">#1</div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{entry.user.name}</div>
                                    <div className="text-xs text-yellow-500/80 font-mono flex items-center gap-1">
                                        <Crown size={10} /> {entry.wins} {t('wins_label')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6 mb-8">
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex bg-[#27272a] p-1 rounded-xl border border-gray-800 w-full md:w-auto">
                        <button
                            onClick={() => handleTabChange('active')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                subTab === 'active' ? 'bg-[#FC4C02] text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            } cursor-pointer`}
                        >
                            <PlayCircle size={16} /> {t('tab_active')}
                        </button>
                        <button
                            onClick={() => handleTabChange('history')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                subTab === 'history' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                            } cursor-pointer`}
                        >
                            <History size={16} /> {t('tab_history')}
                        </button>
                    </div>

                    {membership.is_admin && (
                        <button
                            onClick={() => setIsChallengeModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 text-sm text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                            <Plus size={16} /> {t('groups_new_challenge')}
                        </button>
                    )}
                </div>

                {(challenges.length > 0 || pastChallenges.length > 0) && (
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                                type="text"
                                placeholder={t('challenges_search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-[#18181b] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#FC4C02] focus:border-[#FC4C02] outline-none transition-all placeholder-gray-600"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="relative min-w-45">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <select
                                value={typeFilter}
                                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                                className="w-full bg-[#18181b] border border-gray-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-white focus:ring-1 focus:ring-[#FC4C02] focus:border-[#FC4C02] outline-none appearance-none cursor-pointer"
                            >
                                <option value="all">{t('filter_all_types')}</option>
                                <option value="total_distance">{t('challenge_type_total_distance')}</option>
                                <option value="max_distance">{t('challenge_type_max_distance')}</option>
                                <option value="max_elevation">{t('challenge_type_max_elevation')}</option>
                                <option value="total_time">{t('challenge_type_total_time')}</option>
                                <option value="most_activities">{t('challenge_type_most_activities')}</option>
                                
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {paginatedItems.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedItems.map(challenge => (
                            <div key={challenge.id} className={subTab === 'history' ? 'opacity-75 hover:opacity-100 transition-opacity' : ''}>
                                <ChallengeCard auth={auth} challenge={challenge} isPast={subTab === 'history'} />
                            </div>
                        ))}
                    </div>

                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <div className="bg-[#27272a] rounded-3xl p-12 text-center border border-gray-800 text-gray-500 animate-fade-in">
                    {searchQuery || typeFilter !== 'all' ? (
                        <>
                            <Search size={48} className="mx-auto mb-4 opacity-30" />
                            <p>{t('challenges_no_results')}</p>
                            <button onClick={() => { setSearchQuery(""); setTypeFilter("all"); }} className="mt-4 text-[#FC4C02] text-sm hover:underline">
                                {t('btn_clear_filters')}
                            </button>
                        </>
                    ) : (
                        <>
                            {subTab === 'active' ? <PlayCircle size={48} className="mx-auto mb-4 opacity-30" /> : <History size={48} className="mx-auto mb-4 opacity-30" />}
                            <p>{subTab === 'active' ? t('groups_no_challenges') : t('groups_no_past_challenges')}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}