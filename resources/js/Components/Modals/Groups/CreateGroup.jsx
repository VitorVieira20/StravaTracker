import { useForm } from '@inertiajs/react';
import { X, Upload, Trash2 } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';
import { useState, useEffect } from 'react';

export default function CreateGroupModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        name: '',
        description: '',
        image: null,
    });

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = (e) => {
        e.preventDefault();
        setData('image', null);
        setPreview(null);
    };

    const handleClose = () => {
        reset();
        setPreview(null);
        clearErrors();
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('groups.store'), {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>

            <div className="bg-[#18181b] w-full max-w-lg rounded-3xl border border-gray-800 p-8 relative z-10 shadow-2xl">
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">{t('groups_create_title')}</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('groups_name_label')}</label>
                        <input
                            type="text"
                            className="w-full bg-[#27272a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#FC4C02] focus:ring-0"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('groups_description_label')}</label>
                        <textarea
                            rows="3"
                            className="w-full bg-[#27272a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#FC4C02] focus:ring-0 resize-none"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('groups_cover_label')}</label>
                        
                        <div className="relative">
                            {preview ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700 group">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button 
                                            type="button"
                                            onClick={removeImage}
                                            className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-transform hover:scale-110 cursor-pointer"
                                            title="Remover imagem"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="block border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-[#FC4C02] hover:bg-white/5 transition-all">
                                    <Upload className="mx-auto text-gray-500 mb-2" size={24} />
                                    <span className="text-xs text-gray-400 font-medium block">{t('groups_upload_instruction')}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={handleClose} className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 font-semibold hover:bg-white/5 transition-colors cursor-pointer">
                            {t('groups_cancel')}
                        </button>
                        <button disabled={processing} className="flex-1 bg-[#FC4C02] hover:bg-[#e34402] text-white py-3 rounded-xl font-semibold shadow-lg shadow-orange-900/20 transition-all cursor-pointer">
                            {t('groups_create_btn')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}