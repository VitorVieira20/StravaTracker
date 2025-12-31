import { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardSideContent from '../Components/Dashboard/SideContent';
import DashboardMainContent from '../Components/Dashboard/MainContent';

const SLIDE_DURATION = 15000;

export default function TVDashboard({ stravaData, raceGoal, weeklyHistory }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    const isScrollingRef = useRef(false);
    const touchStartX = useRef(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isScrollingRef.current) {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
            }
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleWheel = (e) => {
            if (isScrollingRef.current) return;

            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

            if (Math.abs(delta) < 20) return;

            isScrollingRef.current = true;

            if (delta > 0) {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
            } else {
                setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
            }

            setTimeout(() => {
                isScrollingRef.current = false;
            }, 800);
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (isScrollingRef.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (Math.abs(diff) < 50) return;

        isScrollingRef.current = true;

        if (diff > 0) {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        } else {
            setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
        }

        setTimeout(() => {
            isScrollingRef.current = false;
        }, 500);
    };

    return (
        <div
            className="min-h-screen w-full bg-[#18181b] text-white font-sans flex flex-col lg:flex-row overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <Head title="TV Dashboard" />

            <DashboardSideContent raceGoal={raceGoal} stravaData={stravaData} />

            <DashboardMainContent stravaData={stravaData} weeklyHistory={weeklyHistory} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
        </div >
    );
}