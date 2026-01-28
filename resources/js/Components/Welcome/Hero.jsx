import { ChevronRight, Lock } from "lucide-react";
import { route } from "ziggy-js";
import { motion } from "framer-motion";

export default function HeroSection() {

    return (
        <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
            {/* Background Glows */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-250 h-125 bg-orange-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <motion.div
                initial="hidden"
                animate="show"
                viewport={{ once: true }}
                variants={{
                    hidden: {},
                    show: {
                        transition: {
                            staggerChildren: 0.15,
                        },
                    },
                }}
                className="max-w-5xl mx-auto text-center"
            >
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FC4C02]/30 bg-[#FC4C02]/10 text-[#FC4C02] text-xs font-bold uppercase tracking-wider mb-8"
                >
                    <Lock size={12} /> Private Beta Access
                </motion.div>

                <motion.h1
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
                >
                    Your Running Data.<br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FC4C02] to-yellow-500">
                        The Big Screen Experience.
                    </span>
                </motion.h1>

                <motion.p
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    A smart dashboard designed for "TV Mode". Focus on goal tracking,
                    performance prediction, and community challenges without lifting a finger.
                </motion.p>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        show: { opacity: 1, y: 0, transition: { type: 'spring' } },
                    }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href={route('strava.redirect')}
                        className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                        Start Tracking <ChevronRight size={20} />
                    </a>
                    <a
                        href="#features"
                        className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                    >
                        Learn more
                    </a>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-20 max-w-6xl mx-auto relative group"
            >
                <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative rounded-2xl border border-white/10 bg-[#18181b] overflow-hidden shadow-2xl">
                    <img
                        src="/images/screenshots/slide_volume.png"
                        alt="Dashboard Preview"
                        className="w-full h-auto opacity-90 hover:opacity-100 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-transparent to-transparent opacity-60"></div>
                </div>
            </motion.div>
        </div>
    );
}