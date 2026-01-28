import { Head } from '@inertiajs/react';
import Navbar from '../Components/Welcome/Navbar';
import HeroSection from '../Components/Welcome/Hero';
import PartnersAndBadges from '../Components/Welcome/Partners';
import Features from '../Components/Welcome/Features';
import Consistency from '../Components/Welcome/Consistency';
import CTA from '../Components/Welcome/CTA';
import Footer from '../Components/Welcome/Footer';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-[#09090b] text-white selection:bg-[#FC4C02] selection:text-white overflow-x-hidden font-sans">
            <Head title="Welcome to Run Tracker" />

            <Navbar auth={auth} />

            <HeroSection />

            <PartnersAndBadges />

            <Features />

            <Consistency />

            <CTA />

            <Footer />
        </div>
    );
}