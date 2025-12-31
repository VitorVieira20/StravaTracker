import { useEffect, useState } from "react";
import ChartSlide from "./Slides/Chart";
import LastRunSlide from "./Slides/LastRun";
import WeeklyGridSlide from "./Slides/WeeklyGrid";

const SLIDE_DURATION = 15000;

export default function DashboardMainContent({ stravaData, weeklyHistory, currentSlide, setCurrentSlide }) {    
    useEffect(() => {
        const timer = setInterval(() => {
            if (!isScrollingRef.current) {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
            }
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="w-full lg:w-[70%] h-auto lg:h-screen relative bg-[#18181b] p-4 lg:p-12 lg:px-8 flex flex-col justify-start lg:justify-center z-10">

            <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex gap-3 z-50">
                {[0, 1, 2].map((idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2.5 lg:h-4 rounded-full transition-all duration-500 cursor-pointer ${currentSlide === idx ? 'w-10 lg:w-14 bg-[#FC4C02]' : 'w-2.5 lg:w-4 bg-gray-700 hover:bg-gray-500'}`}
                    />
                ))}
            </div>

            {currentSlide === 0 && (
                <ChartSlide stravaData={stravaData} />
            )}

            {currentSlide === 1 && stravaData.activities.length > 0 && (
                <LastRunSlide stravaData={stravaData} />
            )}

            {currentSlide === 2 && (
                <WeeklyGridSlide weeklyHistory={weeklyHistory} />
            )}
        </main>
    );
}