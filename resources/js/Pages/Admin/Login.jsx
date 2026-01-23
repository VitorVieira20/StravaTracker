import { Head, useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.auth'));
    };

    return (
        <div className="min-h-screen bg-[#18181b] flex items-center justify-center p-4">
            <Head title="Admin Access" />
            
            <div className="w-full max-w-md bg-[#27272a] p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[#FC4C02]/10 rounded-full">
                        <Lock className="text-[#FC4C02]" size={32} />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center mb-6">Acesso Restrito</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Código de Acesso"
                            className="w-full bg-[#18181b] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#FC4C02] focus:ring-0 placeholder-gray-500 text-center tracking-widest"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                        {errors.code && <div className="text-red-500 text-sm mt-1 text-center">{errors.code}</div>}
                    </div>

                    <button
                        disabled={processing}
                        className="w-full bg-[#FC4C02] hover:bg-[#e34402] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-900/20"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}