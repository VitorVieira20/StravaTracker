import { useState, useRef, useEffect } from 'react';
import { ArrowDownUp, Check, Calendar, Timer, Zap, MapPin, Flame } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function ActivityFilters({ currentSort, onSortChange }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { value: 'date_desc', label: t('sort_date_desc') || 'Mais Recentes', icon: Calendar },
        { value: 'date_asc', label: t('sort_date_asc') || 'Mais Antigas', icon: Calendar },
        { type: 'divider' },
        { value: 'distance_desc', label: t('sort_dist_desc') || 'Maior Distância', icon: MapPin },
        { value: 'distance_asc', label: t('sort_dist_asc') || 'Menor Distância', icon: MapPin },
        { type: 'divider' },
        { value: 'pace_fastest', label: t('sort_pace_fast') || 'Mais Rápidas (Pace)', icon: Zap },
        { value: 'pace_slowest', label: t('sort_pace_slow') || 'Mais Lentas (Pace)', icon: Zap },
        { type: 'divider' },
        { value: 'time_desc', label: t('sort_time_desc') || 'Mais Longas (Tempo)', icon: Timer },
        { value: 'time_asc', label: t('sort_time_asc') || 'Mais Curtas (Tempo)', icon: Timer },
        { type: 'divider' },
        { value: 'calories_desc', label: t('sort_cal_desc') || 'Mais Calorias', icon: Flame },
        { value: 'calories_asc', label: t('sort_cal_asc') || 'Menos Calorias', icon: Flame },
    ];

    const currentLabel = options.find(o => o.value === currentSort)?.label || options[0].label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-[#27272a] hover:bg-[#323236] border border-gray-700 rounded-xl px-4 py-3 text-white transition-all w-full md:w-auto justify-between min-w-50 cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <ArrowDownUp size={16} className="text-[#FC4C02]" />
                    <span className="text-sm font-medium">{currentLabel}</span>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-full md:w-64 bg-[#18181b] border border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-80 overflow-y-auto py-2">
                        {options.map((option, idx) => {
                            if (option.type === 'divider') {
                                return <div key={idx} className="h-px bg-gray-800 my-2 mx-4" />;
                            }

                            const Icon = option.icon;
                            const isSelected = currentSort === option.value || (!currentSort && option.value === 'date_desc');

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onSortChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm transition-colors cursor-pointer
                                        ${isSelected ? 'bg-[#FC4C02]/10 text-[#FC4C02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={16} className={isSelected ? 'text-[#FC4C02]' : 'text-gray-500'} />
                                        <span>{option.label}</span>
                                    </div>
                                    {isSelected && <Check size={16} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}