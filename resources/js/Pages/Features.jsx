import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, Timer, Trophy, Tv, Users, Activity, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features({ auth }) {
    const featuresList = [
        {
            icon: <Tv className="text-blue-400" size={28} />,
            title: "TV Mode Dashboard",
            desc: "The interface is designed to be read from 10 feet away. The auto-carousel mode rotates through vital metrics without you needing to touch the mouse.",
            points: ["Auto-rotation", "Native Dark Mode", "High contrast visualization"]
        },
        {
            icon: <Timer className="text-purple-400" size={28} />,
            title: "AI Race Predictor",
            desc: "We don't just use your average pace. Our algorithm filters out recovery runs and uses GAP (Grade Adjusted Pace) from your best efforts to predict realistic times.",
            points: ["Marathon, Half, & 10k Estimates", "Based on Riegel's Formula", "Smart workout filtering"]
        },
        {
            icon: <Activity className="text-cyan-400" size={28} />,
            title: "Activity Log & Details",
            desc: "Access your complete history. Dive deep into individual activity details, lap splits, and specific metrics to understand your performance on every run.",
            points: ["Full activity history", "Detailed lap analysis", "Pace & Heart Rate data"]
        },
        {
            icon: <Users className="text-yellow-400" size={28} />,
            title: "Groups & Community",
            desc: "Run with friends. Create private groups for your squad or join public tribes for motivation.",
            points: ["Member management", "Private/Public Groups", "Admin tools"]
        },
        {
            icon: <Trophy className="text-orange-400" size={28} />,
            title: "Challenges & Leaderboards",
            desc: "Real gamification. Create competitions based on volume, elevation, or time and see who leads the table.",
            points: ["Elevation Challenges", "Distance Challenges", "Real-time Rankings"]
        },
        {
            icon: <Calendar className="text-green-400" size={28} />,
            title: "Consistency Heatmap",
            desc: "Visualize your year at a glance. The 'GitHub contribution graph' style instantly shows if you've been putting in the work week after week.",
            points: ["Annual view", "Streak detector", "Weekly volume analysis"]
        },
        {
            icon: <Medal className="text-red-400" size={28} />,
            title: "Milestones & Badges",
            desc: "Celebrate every victory. Automatically track your Personal Records and earn unique Badges for hitting distance and elevation milestones.",
            points: ["Automatic PR detection", "Collectible Badges tab", "Visual Milestone celebration"]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { type: 'spring', stiffness: 50 } 
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#FC4C02] selection:text-white">
            <Head title="Features - Run Tracker" />

            <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft size={16} /> <span className="font-semibold text-sm">Back to Home</span>
                    </Link>
                    <a
                        href={route('strava.redirect')}
                        className="bg-[#FC4C02] hover:bg-[#e34402] text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2"
                    >
                        Get Started <ArrowRight size={16} />
                    </a>
                </div>
            </nav>

            <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        More than a <br/>
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FC4C02] to-yellow-500">Training Log.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Run Tracker focuses on what matters: Consistency, Goals, and Community.
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {featuresList.map((feature, idx) => (
                        <motion.div 
                            key={idx} 
                            variants={itemVariants}
                            whileHover={{ y: -8, borderColor: 'rgba(252, 76, 2, 0.4)' }}
                            className="bg-[#18181b] border border-white/10 rounded-2xl p-6 transition-colors group cursor-default"
                        >
                            <div className="mb-5 flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#FC4C02]/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold group-hover:text-[#FC4C02] transition-colors">{feature.title}</h3>
                            </div>
                            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                            <ul className="space-y-3">
                                {feature.points.map((point, pIdx) => (
                                    <li key={pIdx} className="flex items-center gap-3 text-xs font-medium text-gray-300">
                                        <CheckCircle size={14} className="text-[#FC4C02]/70" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-24 text-center"
                >
                    <a
                        href={route('strava.redirect')}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center gap-2 transform hover:scale-105 active:scale-95 duration-300"
                    >
                        Start Your Journey <ArrowRight size={20} />
                    </a>
                </motion.div>
            </div>
            
            <footer className="border-t border-white/5 py-8 bg-[#09090b] text-center text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Vitor Vieira. All rights reserved.
            </footer>
        </div>
    );
}