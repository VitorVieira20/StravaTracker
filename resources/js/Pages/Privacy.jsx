import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#FC4C02] selection:text-white">
            <Head title="Privacy Policy - Run Tracker" />

            <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft size={16} /> <span className="font-semibold text-sm">Back to Home</span>
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-lg text-gray-500">Last Updated: January 28, 2026</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none mx-auto text-gray-300 prose-headings:text-white prose-h2:text-2xl prose-h2:font-bold prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4 prose-h2:mb-6 prose-a:text-[#FC4C02] hover:prose-a:text-[#e34402] prose-strong:text-white">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to Run Tracker. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy explains how we collect, use, and protect your personal information when you use our service by connecting your Strava account.
                    </p>

                    <h2>2. Data We Collect</h2>
                    <p>
                        To provide our services, we require access to certain data from your Strava account. We only request the minimum data necessary to make Run Tracker functional. This includes:
                    </p>
                    <ul>
                        <li><strong>Profile Information:</strong> Your public Strava profile information, including your name, profile picture, and username. This is used to personalize your experience.</li>
                        <li><strong>Activity Data:</strong> We access your running activities, including metrics like distance, time, elevation, pace, and location data (if available). We do not store detailed GPS tracks, only aggregated data needed for our features.</li>
                        <li><strong>Authentication Token:</strong> We store a secure token provided by Strava's OAuth2 flow. This allows us to sync your new activities without requiring you to log in repeatedly.</li>
                    </ul>

                    <h2>3. How We Use Your Data</h2>
                    <p>
                        Your data is used exclusively to power the features of Run Tracker. We do not sell, rent, or share your personal data with third parties for marketing purposes. The primary uses of your data are:
                    </p>
                    <ul>
                        <li><strong>Dashboard Visualization:</strong> To create charts, heatmaps, and summaries of your running performance.</li>
                        <li><strong>Race Time Prediction:</strong> To analyze your best efforts and predict potential race times using established formulas.</li>
                        <li><strong>Community Features:</strong> To populate leaderboards for groups and challenges you participate in.</li>
                        <li><strong>Personal Bests:</strong> To automatically identify and track your personal records.</li>
                    </ul>
                    <p>
                        <strong>We will never sell your personal data.</strong> Your privacy is a core principle of our service.
                    </p>

                    <h2>4. Data Security</h2>
                    <p>
                        We take data security seriously. All data transferred between your browser, our servers, and the Strava API is encrypted using TLS (Transport Layer Security). The access tokens for your Strava account are stored encrypted in our database. We implement industry-standard security measures to prevent unauthorized access, disclosure, or alteration of your data.
                    </p>

                    <h2>5. Data Retention and Deletion</h2>
                    <p>
                        You are in full control of your data. You can disconnect your account from Run Tracker at any time by revoking access in your Strava account settings under "My Apps."
                    </p>
                    <p>
                        If you wish to have all your data permanently deleted from our servers, please send an email to <a href="mailto:privacy@run-tracker.com">privacy@run-tracker.com</a> with the subject "Data Deletion Request." We will process your request and confirm the deletion of your account and all associated activity data within 30 days.
                    </p>

                    <h2>6. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. If we make significant changes, we will notify you by email or through a notice on the platform. We encourage you to review this page periodically for the latest information on our privacy practices.
                    </p>
                </div>
            </div>

            <footer className="border-t border-white/5 py-8 bg-[#09090b] text-center text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Vitor Vieira. All rights reserved.
            </footer>
        </div>
    );
}