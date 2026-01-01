import { Head, useForm } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';

export default function SetGoal({ goal }) {
    const { t } = useTranslation();
    const isEditing = !!goal;

    const { data, setData, post, put, processing, errors } = useForm({
        name: goal?.name || '',
        race_date: goal?.race_date ? goal.race_date.split('T')[0] : '',
        location: goal?.location || '',
        race_distance: goal?.race_distance || 42.195,
        start_date: goal?.start_date ? goal.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
        weekly_goal_km: goal?.weekly_goal_km || 40
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('goals.update'));
        } else {
            post(route('goals.store'));
        }
    };

    return (
        <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center p-4 text-white font-sans">
            <Head title={t('goal_head_title')} />

            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black mb-2">
                        {isEditing ? t('goal_edit_title') : t('goal_create_title')}
                    </h1>
                    <p className="text-gray-400">
                        {isEditing ? t('goal_edit_desc') : t('goal_create_desc')}
                    </p>
                </div>

                <form onSubmit={submit} className="bg-[#27272a] p-8 rounded-3xl border border-gray-800 shadow-2xl space-y-6">

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('lbl_name')}</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder={t('ph_name')}
                            className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-white focus:border-[#FC4C02] focus:ring-0"
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('lbl_location')}</label>
                        <input
                            type="text"
                            value={data.location}
                            onChange={e => setData('location', e.target.value)}
                            placeholder={t('ph_location')}
                            className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-white focus:border-[#FC4C02] focus:ring-0"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{t('lbl_distance')}</label>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                step="0.001"
                                value={data.race_distance}
                                onChange={e => setData('race_distance', e.target.value)}
                                className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-white focus:border-[#FC4C02] focus:ring-0 font-mono"
                                placeholder="42.195"
                            />
                            <span className="text-gray-500 font-bold">km</span>
                        </div>
                        {errors.race_distance && <div className="text-red-500 text-xs mt-1">{errors.race_distance}</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('lbl_race_date')}</label>
                            <input
                                type="date"
                                value={data.race_date}
                                onChange={e => setData('race_date', e.target.value)}
                                className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-white focus:border-[#FC4C02] focus:ring-0"
                            />
                            {errors.race_date && <div className="text-red-500 text-xs mt-1">{errors.race_date}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('lbl_start_date')}</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                                className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-white focus:border-[#FC4C02] focus:ring-0"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">{t('help_start_date')}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{t('lbl_weekly_goal')}</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="10" max="150" step="1"
                                value={data.weekly_goal_km}
                                onChange={e => setData('weekly_goal_km', e.target.value)}
                                className="w-full accent-[#FC4C02]"
                            />
                            <span className="font-black text-xl w-16 text-right">{data.weekly_goal_km} km</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full font-bold py-4 rounded-xl transition-all transform flex items-center justify-center mt-4 cursor-pointer
                            ${processing ? 'bg-orange-400 cursor-not-allowed opacity-80' : 'bg-[#FC4C02] hover:bg-[#e34402] hover:scale-[1.02] text-white'}`}
                    >
                        {processing ? t('btn_saving') : (isEditing ? t('btn_update') : t('btn_create'))}
                    </button>

                    {isEditing && (
                        <a href={route('dashboard.index')} className="block text-center text-gray-500 text-md hover:text-white transition-colors">
                            {t('btn_cancel')}
                        </a>
                    )}
                </form>
            </div>
        </div >
    );
}