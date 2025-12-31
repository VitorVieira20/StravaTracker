import { Head, useForm } from '@inertiajs/react';
import { LifeBuoy, Send } from 'lucide-react';

export default function Contact({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        subject: '',
        message: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('support.store'));
    };

    return (
        <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center p-4 text-white font-sans">
            <Head title="Suporte" />

            <div className="w-full max-w-2xl">
                <div className="bg-[#27272a] p-2 md:p-6 rounded-3xl border border-gray-800 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                        <div className="bg-[#FC4C02]/20 p-3 rounded-full">
                            <LifeBuoy size={32} className="text-[#FC4C02]" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-center text-white">Precisa de Ajuda?</h1>
                            <p className="text-gray-400 text-sm">Preencha o formulário abaixo.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-gray-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                                <input
                                    type="text"
                                    value={data.email}
                                    className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-gray-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Assunto</label>
                            <select
                                value={data.subject}
                                onChange={e => setData('subject', e.target.value)}
                                className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-white focus:outline-none appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Selecione um motivo...</option>
                                <option value="bug">Reportar um erro (Bug)</option>
                                <option value="feature">Sugestão de Funcionalidade</option>
                                <option value="account">Problema com a Conta</option>
                                <option value="other">Outro</option>
                            </select>
                            {errors.subject && <div className="text-red-500 text-xs mt-1">{errors.subject}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mensagem</label>
                            <textarea
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                rows="5"
                                placeholder="Descreva o problema detalhadamente..."
                                className="w-full bg-[#18181b] border border-gray-700 rounded-xl p-3 text-white focus:outline-none resize-none"
                            ></textarea>
                            {errors.message && <div className="text-red-500 text-xs mt-1">{errors.message}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full font-bold py-2 md:py-4 rounded-xl transition-all transform flex items-center justify-center gap-2 cursor-pointer
                                ${processing ? 'bg-orange-400 cursor-not-allowed opacity-80' : 'bg-[#FC4C02] hover:bg-[#e34402] hover:scale-[1.02] text-white'}`}
                        >
                            {processing ? 'A enviar...' : (
                                <>
                                    <span className="text-md md:text-lg">Enviar Mensagem</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>
                        <a href={route('dashboard.index')} className="block text-center text-gray-500 text-md hover:text-white transition-colors">
                            Voltar
                        </a>
                    </form>
                </div>
            </div>
        </div>
    );
}