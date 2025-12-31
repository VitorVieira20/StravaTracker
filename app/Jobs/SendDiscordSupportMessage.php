<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SendDiscordSupportMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;
    protected $validatedData;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, array $validatedData)
    {
        $this->user = $user;
        $this->validatedData = $validatedData;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $webhookUrl = config('services.discord.channels.support');

        if (!$webhookUrl) {
            return;
        }

        Http::post($webhookUrl, [
            'embeds' => [
                [
                    'title' => "🔔 Novo Pedido de Suporte: " . $this->validatedData['subject'],
                    'color' => 16556034,
                    'fields' => [
                        [
                            'name' => '👤 Utilizador',
                            'value' => "**{$this->user->name}** (`{$this->user->email}`)",
                            'inline' => true
                        ],
                        [
                            'name' => '🆔 User ID',
                            'value' => (string) $this->user->id,
                            'inline' => true
                        ],
                        [
                            'name' => '📝 Mensagem',
                            'value' => $this->validatedData['message']
                        ]
                    ],
                    'footer' => [
                        'text' => 'Enviado via Run Tracker Dashboard - Queue Worker',
                        'icon_url' => 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo.png'
                    ],
                    'timestamp' => now()->toIso8601String()
                ]
            ]
        ]);
    }
}
