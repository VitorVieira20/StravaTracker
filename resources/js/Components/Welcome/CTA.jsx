import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {

    return (
        <div className="py-32 px-6 text-center bg-[#09090b]">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, staggerChildren: 0.2 }
                    }
                }}
                className="max-w-3xl mx-auto"
            >
                <motion.h2
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Ready to upgrade your running?
                </motion.h2>

                <motion.p
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="text-gray-400 mb-10 text-lg"
                >
                    Join the private beta today.
                </motion.p>

                <motion.div
                    variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.4 } }
                    }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 inline-block text-left hover:border-[#FC4C02]/30 transition-colors"
                >
                    <div className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-white">Current Status: Free Public Beta</h4>
                            <p className="text-gray-400 text-sm mt-1">
                                Run Tracker will become a paid service (SaaS) in the future.<br />
                                <span className="text-[#FC4C02]">Users registered during the beta phase will retain free lifetime access.</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                <br />

                <motion.a
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(252, 76, 2, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    href={route('strava.redirect')}
                    className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-orange-900/30 inline-flex items-center gap-2"
                >
                    Secure Free Access <ArrowRight size={20} />
                </motion.a>
            </motion.div>
        </div>
    );
}