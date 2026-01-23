import { Head, router, Link } from '@inertiajs/react';
import { Search, ArrowUpDown, ShieldCheck, LogOut, ExternalLink, Activity, Medal, MapPin } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function AdminDashboard({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.get(route('admin.dashboard'), { 
                search, 
                sort: filters.sort, 
                direction: filters.direction 
            }, { preserveState: true });
        }
    };

    const handleSort = (field) => {
        const currentDir = filters.direction || 'desc';
        const newDir = (filters.sort === field && currentDir === 'desc') ? 'asc' : 'desc';

        router.get(route('admin.dashboard'), { 
            search, 
            sort: field, 
            direction: newDir 
        }, { preserveState: true });
    };

    const SortIcon = ({ field }) => {
        if (filters.sort !== field) return <ArrowUpDown size={14} className="opacity-30" />;
        return <ArrowUpDown size={14} className={filters.direction === 'asc' ? 'text-[#FC4C02] rotate-180' : 'text-[#FC4C02]'} />;
    };

    return (
        <div className="min-h-screen bg-[#18181b] text-white p-4 md:p-8 font-sans">
            <Head title="Backoffice" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-800 rounded-xl">
                            <ShieldCheck className="text-[#FC4C02]" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Utilizadores</h1>
                            <p className="text-gray-400 text-sm">Total: {users.total} contas registadas</p>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Pesquisar nome, email..."
                                className="w-full bg-[#27272a] border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#FC4C02] focus:ring-0"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                        <Link 
                            href={route('admin.logout')} 
                            method="post" 
                            as="button" 
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2.5 rounded-xl border border-red-500/20 transition-colors"
                        >
                            <LogOut size={20} />
                        </Link>
                    </div>
                </div>

                <div className="bg-[#27272a] rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#202022] text-gray-400 uppercase font-bold border-b border-gray-800">
                                <tr>
                                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-2">Utilizador <SortIcon field="name" /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white text-center" onClick={() => handleSort('activities')}>
                                        <div className="flex items-center justify-center gap-2"><Activity size={14} /> Atividades <SortIcon field="activities" /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white text-center" onClick={() => handleSort('distance')}>
                                        <div className="flex items-center justify-center gap-2"><MapPin size={14} /> Distância (km) <SortIcon field="distance" /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white text-center" onClick={() => handleSort('badges')}>
                                        <div className="flex items-center justify-center gap-2"><Medal size={14} /> Badges <SortIcon field="badges" /></div>
                                    </th>
                                    <th className="p-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('created_at')}>
                                        <div className="flex items-center justify-end gap-2">Registado <SortIcon field="created_at" /></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-white text-base">{user.name}</div>
                                            <div className="text-gray-500 text-xs">{user.email}</div>
                                            <div className="text-gray-600 text-[10px] mt-1 font-mono">ID: {user.id}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-gray-800 text-white px-3 py-1 rounded-lg font-bold">
                                                {user.activities_count}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="text-gray-300 font-mono">
                                                {user.total_distance ? (user.total_distance / 1000).toFixed(1) : '0.0'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-lg font-bold ${user.badges_count > 0 ? 'bg-orange-500/10 text-[#FC4C02]' : 'text-gray-600 bg-gray-800/50'}`}>
                                                {user.badges_count}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right text-gray-400">
                                            {new Date(user.created_at).toLocaleDateString('pt-PT')}
                                            <div className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#FC4C02] mt-1 cursor-pointer">
                                                Ver Detalhes
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="mt-6 flex justify-center gap-2">
                    {users.links.map((link, i) => (
                        link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-4 py-2 rounded-lg text-sm font-bold ${link.active ? 'bg-[#FC4C02] text-white' : 'bg-[#27272a] text-gray-400 hover:bg-gray-700'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : null
                    ))}
                </div>
            </div>
        </div>
    );
}