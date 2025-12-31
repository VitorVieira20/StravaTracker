import { Calendar, Timer } from "lucide-react";

export default function WeeklyGridSlide({ weeklyHistory }) {

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 h-auto flex flex-col justify-start pt-12 lg:pt-0">

            <div className="mb-4 lg:hidden">
                <h2 className="text-xl font-bold text-gray-200 flex items-center">
                    <Calendar className="mr-2 text-[#FC4C02]" size={20} /> Histórico
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4 w-full h-auto content-start">
                {weeklyHistory.slice(0, 20).map((week, idx) => {
                    const isGoodWeek = week.total_distance > 30;
                    const isZeroWeek = week.total_distance === 0;

                    return (
                        <div
                            key={idx}
                            className={`
                                relative rounded-xl p-3 lg:p-4 flex flex-col justify-between border-t-4 shadow-lg transition-transform duration-500
                                ${isGoodWeek ? 'bg-[#27272a] border-[#FC4C02]' : 'bg-[#202022] border-gray-700'}
                                ${isZeroWeek ? 'opacity-50 grayscale' : 'opacity-100'}
                            `}
                            style={{ aspectRatio: '1.4/1' }}
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-xs lg:text-lg uppercase font-bold text-gray-100 tracking-wider">
                                    {week.week_label.split('-')[0]}
                                </span>
                                {week.activity_count > 0 && (
                                    <span className="bg-gray-800 text-gray-300 text-[10px] lg:text-xs px-2 py-0.5 rounded-full font-bold">
                                        {week.activity_count} x
                                    </span>
                                )}
                            </div>

                            <div className="text-center my-1 lg:my-2">
                                <span className="block text-2xl lg:text-3xl font-bold text-white mb-0.5">
                                    {week.total_distance}
                                </span>
                                <span className="text-[10px] lg:text-xs text-gray-600 uppercase font-bold">km</span>
                            </div>

                            <div className="flex justify-center items-center gap-1 text-gray-500 text-xs lg:text-sm font-medium bg-black/20 py-1 rounded-lg">
                                <Timer size={10} className="lg:w-3 lg:h-3" />
                                {week.total_time}
                            </div>

                            {isGoodWeek && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#FC4C02]"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-wrap w-full gap-1 lg:gap-1.5 content-center mt-6 lg:mt-10 mb-8 justify-center lg:justify-start">
                {[...weeklyHistory].reverse().map((week, idx) => {
                    let intensityClass = "bg-gray-800";
                    if (week.total_distance > 0) intensityClass = "bg-[#FC4C02]/30";
                    if (week.total_distance > 15) intensityClass = "bg-[#FC4C02]/60";
                    if (week.total_distance > 30) intensityClass = "bg-[#FC4C02]";

                    return (
                        <div
                            key={idx}
                            className={`w-3 h-5 lg:w-5 lg:h-8 rounded-sm transition-all duration-500 hover:scale-125 ${intensityClass}`}
                        ></div>
                    );
                })}

                {Array.from({ length: Math.max(0, 52 - weeklyHistory.length) }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-3 h-5 lg:w-5 lg:h-8 rounded-sm bg-gray-900/50 border border-gray-800"></div>
                ))}
            </div>
        </div>
    );
}