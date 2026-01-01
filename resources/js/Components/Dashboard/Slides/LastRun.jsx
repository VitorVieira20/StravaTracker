import { Activity, Clock, MapPin, Timer } from "lucide-react";
import useTranslation from '@/Hooks/useTranslation';

export default function LastRunSlide({ stravaData }) {
    const { t } = useTranslation();

    return (
        <div className="animate-in fade-in zoom-in duration-700 h-full flex flex-col justify-center pt-8 lg:pt-0">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-200 flex items-center">
                    <Activity className="mr-3 text-[#FC4C02]" size={32} /> {t('slide_last_run')}
                </h2>
                <span className="text-sm lg:text-xl text-gray-400 bg-gray-800 px-4 py-1 rounded-full">{stravaData.activities[0].date}</span>
            </div>

            <div className="bg-[#27272a] rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-12 border border-gray-700 shadow-2xl relative overflow-hidden">
                <Activity className="absolute -right-10 -bottom-10 text-white opacity-5 w-48 h-48 lg:w-96 lg:h-96" />

                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">{stravaData.activities[0].name}</h3>

                <div className="flex flex-col lg:flex-row gap-8 mt-8 lg:mt-12 relative z-10">
                    <div className="w-full text-center">
                        <MapPin size={32} className="mx-auto text-[#FC4C02] mb-2 lg:mb-4 lg:w-12 lg:h-12" />
                        <div className="text-4xl lg:text-7xl font-semibold text-white tracking-tighter">
                            {stravaData.activities[0].distance}
                        </div>
                        <div className="text-sm lg:text-2xl text-gray-400 uppercase font-bold tracking-widest mt-4">{t('slide_km_label')}</div>
                    </div>
                    <div className="w-full text-center lg:border-l lg:border-gray-700 lg:border-r pt-4 lg:pt-0 border-t border-gray-700 lg:border-t-0">
                        <Timer size={32} className="mx-auto text-gray-400 mb-2 lg:mb-4 lg:w-12 lg:h-12" />
                        <div className="text-4xl lg:text-7xl font-semibold text-white tracking-tighter mt-4">
                            {stravaData.activities[0].pace}
                        </div>
                        <div className="text-sm lg:text-2xl text-gray-400 uppercase font-bold tracking-widest mt-4">{t('slide_pace_label')}</div>
                    </div>
                    <div className="w-full text-center pt-4 lg:pt-0 border-t border-gray-700 lg:border-t-0">
                        <Clock size={32} className="mx-auto text-gray-400 mb-2 lg:mb-4 lg:w-12 lg:h-12" />
                        <div className="text-4xl lg:text-7xl font-semibold text-white tracking-tighter mt-4">
                            {stravaData.activities[0].time}
                        </div>
                        <div className="text-sm lg:text-2xl text-gray-400 uppercase font-bold tracking-widest mt-4">{t('slide_time_label')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}