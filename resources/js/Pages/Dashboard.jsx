import { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardSideContent from '../Components/Dashboard/SideContent';
import DashboardMainContent from '../Components/Dashboard/MainContent';

const SLIDE_DURATION = 15000;

export default function TVDashboard({ stravaData, raceGoal, weeklyHistory, isTvMode }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    const isScrollingRef = useRef(false);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    useEffect(() => {
        let timer;
        if (isTvMode) {
            timer = setInterval(() => {
                if (!isScrollingRef.current) {
                    setCurrentSlide((prev) => (prev + 1) % totalSlides);
                }
            }, SLIDE_DURATION);
        }
        return () => clearInterval(timer);
    }, [isTvMode]);

    
    useEffect(() => {
        const handleWheel = (e) => {
            if (isScrollingRef.current) return;

            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;

            const delta = e.deltaX;

            if (Math.abs(delta) < 50) return;

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
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (isScrollingRef.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchStartX.current - touchEndX;
        const diffY = touchStartY.current - touchEndY;

        if (Math.abs(diffY) > Math.abs(diffX)) return;

        if (Math.abs(diffX) < 50) return;

        isScrollingRef.current = true;

        // Lógica de troca de slide (mantém-se igual)
        if (diffX > 0) {
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