import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <--- Importar createPortal
import ActivityDetails from '@/Components/Modals/Activities/ActivityDetails';
import useTranslation from '@/Hooks/useTranslation';
import { X, Calendar } from 'lucide-react';
import ActivityCard from '../../Activities/ActivityCard';

export default function WeekActivitiesModal({ isOpen, onClose, activities, week }) {
    const { t } = useTranslation();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleCloseDetails = () => {
        setSelectedActivity(null);
    };

    const modalContent = (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 lg:left-[30%]">
            
            <div className="bg-[#18181b] border border-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative"> 
                
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#18181b] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#FC4C02]/10 p-2 rounded-lg text-[#FC4C02]">
                            <Calendar size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">{t('weekly_activities') || 'Atividades da Semana'} {" "} {week.split('-')[0]}</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#18181b]">
                    {activities && activities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {activities.map((activity) => (
                                <ActivityCard 
                                    key={activity.id} 
                                    run={activity} 
                                    setSelectedActivity={setSelectedActivity} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <Calendar size={48} className="mb-4 opacity-20" />
                            <p>{t('no_activities_this_week') || 'Sem atividades nesta semana.'}</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedActivity && (
                <ActivityDetails
                    activity={selectedActivity}
                    onClose={handleCloseDetails}
                />
            )}
        </div>
    );

    return createPortal(modalContent, document.body);
}