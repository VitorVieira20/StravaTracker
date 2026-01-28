import { Activity, Tv, Users } from "lucide-react";

export default function PartnersAndBadges() {

    return (
        <div className="border-y border-white/5 bg-white/2">
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 md:grayscale hover:grayscale-0 transition-all duration-500">
                <img src="https://img.shields.io/badge/Strava_API-Approved-brightgreen?style=for-the-badge&logo=strava&logoColor=white&color=FC4C02" alt="Strava API" className="h-8" />
                <div className="flex items-center gap-2 text-white font-bold text-lg"><Activity /> Performance</div>
                <div className="flex items-center gap-2 text-white font-bold text-lg"><Tv /> TV Mode</div>
                <div className="flex items-center gap-2 text-white font-bold text-lg"><Users /> Community</div>
            </div>
        </div>
    );
}