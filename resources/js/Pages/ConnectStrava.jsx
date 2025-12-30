import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function ConnectStrava() {
    return (
        <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center p-4 text-center">
            <Head title="Conectar Strava" />

            <div className="bg-[#27272a] p-10 rounded-3xl shadow-2xl max-w-xl w-full border border-gray-800">
                <img
                    src="https://cdn.worldvectorlogo.com/logos/strava-2.svg"
                    alt="Strava"
                    className="h-16 mx-auto mb-8 opacity-90 rounded-2xl"
                />

                <h1 className="text-3xl font-bold text-white mb-4">
                    Quase lá!
                </h1>
                <p className="text-gray-400 mb-8 text-lg">
                    Para gerar o teu dashboard de atleta, precisamos de permissão para ler as tuas atividades.
                </p>

                <a
                    href={route('strava.redirect')}
                    className="block w-full bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                    Conectar com Strava
                </a>

                <p className="mt-6 text-xs text-gray-400">
                    Apenas lemos os dados. Não publicamos nada em teu nome.
                </p>
            </div>
        </div>
    );
}