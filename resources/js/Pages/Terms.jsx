import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#FC4C02] selection:text-white">
            <Head title="Terms of Service - Run Tracker" />

            <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft size={16} /> <span className="font-semibold text-sm">Back to Home</span>
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-lg text-gray-500">Last Updated: January 28, 2026</p>
                </div>

                <div className="prose prose-invert prose-lg max-w-none mx-auto text-gray-300 prose-headings:text-white prose-h2:text-2xl prose-h2:font-bold prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4 prose-h2:mb-6 prose-a:text-[#FC4C02] hover:prose-a:text-[#e34402] prose-strong:text-white">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By creating an account and using the Run Tracker service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. Access to the Service is granted by authenticating with your Strava account.
                    </p>

                    <h2>2. Description of Service</h2>
                    <p>
                        Run Tracker is a web-based application that connects to your Strava account to provide data visualization, performance analysis, race predictions, and community features for runners. The Service is provided on an "as is" and "as available" basis.
                    </p>

                    <h2>3. Beta Phase and Future Pricing</h2>
                    <p>
                        The Service is currently in a <strong>Public Beta</strong> phase.
                    </p>
                    <ul>
                        <li>Access to the service is free during the Beta phase.</li>
                        <li>We reserve the right to introduce paid subscription plans ("Pro" plans) in the future for new features and advanced functionalities.</li>
                        <li><strong>Users who register during the Beta phase will retain free lifetime access to the core features available at the time of their registration.</strong> Specific features that will be part of future paid plans will be clearly communicated.</li>
                    </ul>

                    <h2>4. User Conduct and Responsibilities</h2>
                    <p>
                        You agree to use the Service only for its intended purposes. You must not:
                    </p>
                    <ul>
                        <li>Attempt to reverse-engineer, decompile, or otherwise discover the source code of the Service.</li>
                        <li>Use automated scripts, bots, or other means to access or interact with the Service in a way that could impair its performance or security.</li>
                        <li>Use the Service for any illegal or unauthorized purpose.</li>
                        <li>Create offensive or abusive content within community features (e.g., group names, challenge descriptions).</li>
                    </ul>
                    <p>
                        Violation of these terms may result in the suspension or termination of your account.
                    </p>

                    <h2>5. Disclaimer of Warranties and Limitation of Liability</h2>
                    <p>
                        Run Tracker is a tool designed for informational and motivational purposes. It is not a substitute for professional medical advice or coaching.
                    </p>
                    <ul>
                        <li>The Service is provided without warranties of any kind, whether express or implied. We do not guarantee that the Service will always be accurate, reliable, or available.</li>
                        <li>Race predictions and performance analyses are estimates and should not be considered guarantees of future performance.</li>
                        <li>Run Tracker, its developers, and affiliates will not be liable for any injuries, health problems, or damages that may result from your training or use of the information provided by the Service. Always consult a healthcare professional before starting a new fitness program.</li>
                    </ul>

                    <h2>6. Termination</h2>
                    <p>
                        You can terminate your agreement to these Terms at any time by ceasing to use the Service and deleting your account as described in our Privacy Policy. We reserve the right to suspend or terminate your access to the Service at our discretion, without notice, if you violate these Terms.
                    </p>

                    <h2>7. Changes to the Terms</h2>
                    <p>
                        We may modify these Terms from time to time. If we make material changes, we will provide notice through the Service or by other means to provide you with the opportunity to review the changes before they become effective. Your continued use of the Service after the changes become effective constitutes your acceptance of the new Terms.
                    </p>
                </div>
            </div>

            <footer className="border-t border-white/5 py-8 bg-[#09090b] text-center text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Vitor Vieira. All rights reserved.
            </footer>
        </div>
    );
}