import { Play, Timer, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {

    return (
        <div id="features" className="py-24 px-6 max-w-7xl mx-auto">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to run faster.</h2>
                <p className="text-gray-400">Advanced metrics simplified for visualization.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="lg:col-span-2 lg:row-span-2 bg-[#18181b] border border-white/10 rounded-2xl p-8 hover:border-[#FC4C02]/50 transition-colors group relative overflow-hidden flex flex-col justify-between"
                >
                    <div>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                            <Play size={24} fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Auto-Carousel TV Mode</h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Put it on your secondary monitor or living room TV. The dashboard automatically cycles through volume evolution, consistency heatmaps, and last run details.
                        </p>
                    </div>
                    <div className="relative flex-1 min-h-50 mt-4 rounded-xl overflow-hidden border border-white/10 shadow-xl group-hover:translate-y-2 transition-transform">
                        <img
                            src="/images/screenshots/slide_last_run.png"
                            className="w-full h-full object-cover object-top"
                            alt="Last Run"
                        />
                    </div>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="bg-[#18181b] border border-white/10 rounded-2xl p-8 hover:border-[#FC4C02]/50 transition-colors flex flex-col justify-center"
                >
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                        <Timer size={24} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Smart Race Predictor</h3>
                    <p className="text-gray-400 mb-8 flex-1">
                        Uses the Riegel Formula & GAP to estimate your Marathon, HM, and 10k times.
                    </p>
                    <div className="bg-[#09090b] rounded-xl p-4 border border-white/5 h-30 md:h-20">
                        <div className="flex justify-between items-center mb-5 md:mb-2">
                            <span className="text-md md:text-xs text-gray-500 uppercase">Marathon Est.</span>
                            <span className="text-[#FC4C02] font-bold">3:42:15</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} viewport={{ once: true }} transition={{ duration: 1 }} className="bg-[#FC4C02] h-full rounded-full"></motion.div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="bg-[#18181b] border border-white/10 rounded-2xl p-8 hover:border-[#FC4C02]/50 transition-colors flex flex-col justify-between"
                >
                    <div>
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-6 border border-yellow-500/20">
                            <Users size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Groups & Tribes</h3>
                        <p className="text-gray-400 mb-6">
                            Create public or private running groups. Approve members, manage roles, and build your own digital running club.
                        </p>
                    </div>

                    <div className="bg-[#09090b] border border-white/5 rounded-xl p-4 mt-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-14 md:w-10 h-14 md:h-10 rounded-lg bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-md md:text-xs shadow-lg">
                                    RC
                                </div>
                                <div>
                                    <div className="text-md md:text-sm font-bold text-white leading-tight">Run Club</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Public Group</div>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>

                        <div className="flex items-center justify-between h-20 md:h-10">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`w-10 md:w-7 h-10 md:h-7 rounded-full border-2 border-[#09090b] bg-gray-700 flex items-center justify-center text-[8px] text-white overflow-hidden`}>
                                        <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`} alt="Avatar" />
                                    </div>
                                ))}
                                <div className="w-10 md:w-7 h-10 md:h-7 rounded-full border-2 border-[#09090b] bg-[#27272a] flex items-center justify-center text-[9px] font-bold text-gray-400">
                                    +8
                                </div>
                            </div>
                            <div className="text-xs font-medium text-gray-400">
                                <span className="text-white">12</span> Members
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="lg:col-span-3 bg-[#18181b] border border-white/10 rounded-2xl p-8 hover:border-[#FC4C02]/50 transition-colors relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <div className="w-12 h-12 bg-[#FC4C02]/10 rounded-xl flex items-center justify-center text-[#FC4C02] mb-6 border border-[#FC4C02]/20">
                                <Trophy size={24} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Gamified Leaderboards</h3>
                            <p className="text-gray-400 mb-6">
                                Create challenges based on distance, elevation, or time. Watch live leaderboards update as members sync activities.
                            </p>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="bg-[#09090b] border border-white/5 rounded-xl p-4 w-full">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/80 flex items-center justify-center text-black font-bold text-xs">1</div>
                                    <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-20 bg-gray-700 rounded animate-pulse"></div>
                                        <div className="h-2 w-12 bg-gray-800 rounded animate-pulse"></div>
                                    </div>
                                    <span className="text-[#FC4C02] font-bold">124 km</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-60 mb-4 pb-4 border-b border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">2</div>
                                    <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                                    <div className="flex-1 h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
                                    <span className="text-white">98 km</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-60">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs">3</div>
                                    <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                                    <div className="flex-1 h-3 w-24 bg-gray-700 rounded animate-pulse"></div>
                                    <span className="text-white">93 km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}