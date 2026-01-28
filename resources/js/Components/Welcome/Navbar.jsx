import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';

export default function Navbar({ auth }) {

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-16 md:w-10 h-16 md:h-10" />
                    <span className="hidden md:block font-bold text-xl tracking-tight">Run Tracker</span>
                </div>

                <div className="flex items-center gap-6">
                    {auth.user ? (
                        <Link
                            href={route('dashboard.index')}
                            className="font-semibold text-sm hover:text-[#FC4C02] transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <span className="hidden md:block text-sm text-gray-400">Private Beta</span>
                            <a
                                href={route('strava.redirect')}
                                className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2"
                            >
                                Login with Strava <ArrowRight size={16} />
                            </a>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}