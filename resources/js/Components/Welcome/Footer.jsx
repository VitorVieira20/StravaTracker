import { Link } from "@inertiajs/react";
import { Globe } from "lucide-react";
import { route } from "ziggy-js";

export default function Footer() {

    return (
        <footer className="border-t border-white/5 py-12 bg-[#09090b]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 grayscale opacity-50" />
                        <span className="text-gray-500 font-semibold">Run Tracker</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Vitor Vieira.
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
                    <div className="flex gap-6">
                        <Link href={route('features')} className="text-gray-500 hover:text-white transition-colors">Features</Link>
                        <Link href={route('privacy')} className="text-gray-500 hover:text-white transition-colors">Privacy</Link>
                        <Link href={route('terms')} className="text-gray-500 hover:text-white transition-colors">Terms</Link>
                        <a href="https://github.com/VitorVieira20/StravaTracker" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
                    </div>

                    <div className="hidden md:block w-px h-4 bg-gray-800"></div>

                    <div className="flex items-center gap-2 text-gray-500" title="Available Languages">
                        <Globe size={14} />
                        <span className="font-medium tracking-wider text-xs">EN · PT · ES · FR · IT</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}