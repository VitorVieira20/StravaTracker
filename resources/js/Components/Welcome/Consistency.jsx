import { ArrowRight } from "lucide-react";
import { route } from "ziggy-js";
import { motion } from "framer-motion";

export default function Consistency() {

    return (
        <div className="py-20 bg-linear-to-b from-[#09090b] to-[#18181b] border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        show: { opacity: 1, x: 0, transition: { type: 'spring', duration: 0.8, bounce: 0.3 } },
                    }}
                    className="flex-1"
                >
                    <img
                        src="/images/screenshots/slide_history.png"
                        alt="Heatmap"
                        className="w-full rounded-2xl shadow-2xl border border-white/10"
                    />
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={{
                        hidden: { opacity: 0, x: 50 },
                        show: { opacity: 1, x: 0, transition: { type: 'spring', duration: 0.8, bounce: 0.3, delay: 0.2 } },
                    }}
                    className="flex-1"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Consistency is Key.</h2>
                    <p className="text-lg text-gray-400 mb-6">
                        Visualize your annual training consistency with a GitHub-style heatmap. Spot gaps in your training, celebrate streaks, and ensure you are putting in the work week after week.
                    </p>
                    <a
                        href={route('strava.redirect')}
                        className="text-[#FC4C02] font-bold hover:underline flex items-center gap-2"
                    >
                        Connect Strava to generate yours <ArrowRight size={16} />
                    </a>
                </motion.div>
            </div>
        </div>
    );
}