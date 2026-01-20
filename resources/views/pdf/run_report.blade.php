<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Relatório de Atleta - {{ $user->name }}</title>
    <style>
        @page { margin: 0px; }
        body {
            font-family: 'Helvetica', sans-serif;
            margin: 0;
            padding: 40px;
            color: #18181b;
            line-height: 1.5;
        }

        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 30px 40px;
            margin: -40px -40px 30px -40px;
            border-bottom: 4px solid #FC4C02;
        }
        .header-content { display: table; width: 100%; }
        .brand { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
        .brand span { color: #FC4C02; }
        
        .user-section { margin-bottom: 30px; border-left: 4px solid #FC4C02; padding-left: 15px; }
        .user-name { font-size: 20px; font-weight: bold; color: #000; }
        .user-meta { font-size: 12px; color: #666; }

        .stats-container { width: 100%; margin-bottom: 30px; }
        .stat-card {
            display: inline-block; width: 23%; background-color: #f4f4f5;
            border: 1px solid #e4e4e7; border-radius: 8px; padding: 15px 5px;
            text-align: center; margin-right: 1%;
        }
        .stat-value { display: block; font-size: 18px; font-weight: bold; color: #FC4C02; }
        .stat-label { font-size: 10px; text-transform: uppercase; color: #52525b; letter-spacing: 1px; }

        h2 {
            font-size: 16px; text-transform: uppercase; border-bottom: 2px solid #000;
            padding-bottom: 5px; margin-top: 30px; color: #000; page-break-after: avoid;
        }

        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
        th {
            background-color: #000000; color: #FC4C02; text-transform: uppercase;
            padding: 8px 10px; text-align: left; font-size: 9px; letter-spacing: 1px;
        }
        td { padding: 8px 10px; border-bottom: 1px solid #e4e4e7; color: #333; }
        tr:nth-child(even) { background-color: #fafafa; }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-mono { font-family: 'Courier', monospace; }
        .text-bold { font-weight: bold; }
        .text-orange { color: #FC4C02; }

        .badge-tier {
            font-size: 8px; font-weight: bold; text-transform: uppercase;
            padding: 2px 6px; border-radius: 4px; color: white; display: inline-block;
        }
        .tier-bronze { background-color: #cd7f32; }
        .tier-silver { background-color: #9ca3af; }
        .tier-gold { background-color: #eab308; }
        .tier-platinum { background-color: #3b82f6; }

        .footer {
            position: fixed; bottom: 20px; left: 40px; right: 40px;
            font-size: 9px; text-align: center; color: #a1a1aa;
            border-top: 1px solid #e4e4e7; padding-top: 10px;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-content">
            <div style="display: table-cell; vertical-align: middle;">
                <div class="brand">Run<span>Tracker</span></div>
            </div>
            <div style="display: table-cell; vertical-align: middle; text-align: right;">
                <div style="font-size: 10px; color: #ccc;">RELATÓRIO DE DADOS</div>
                <div style="font-size: 10px; color: #FC4C02;">{{ $generated_at }}</div>
            </div>
        </div>
    </div>

    <div class="user-section">
        <div class="user-name">{{ $user->name }}</div>
        <div class="user-meta">{{ $user->email }} | ID: {{ $user->id }}</div>
        <div class="user-meta">Membro desde {{ $user->created_at->format('d/m/Y') }}</div>
    </div>

    <div class="stats-container">
        <div class="stat-card">
            <span class="stat-value">{{ $stats['total_runs'] }}</span>
            <span class="stat-label">Corridas</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{{ $stats['total_distance'] }} <span style="font-size: 10px;">km</span></span>
            <span class="stat-label">Distância</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{{ $stats['total_time'] }}</span>
            <span class="stat-label">Tempo Total</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{{ $stats['best_pace'] }}</span>
            <span class="stat-label">Melhor Pace</span>
        </div>
    </div>

    @if(count($personalBests) > 0)
    <h2>Recordes Pessoais</h2>
    <table>
        <thead>
            <tr>
                <th width="20%">Distância</th>
                <th width="20%">Tempo</th>
                <th width="20%">Pace Médio</th>
                <th width="40%">Data / Atividade</th>
            </tr>
        </thead>
        <tbody>
            @foreach($personalBests as $label => $record)
                @if(!isset($record['message']))
                <tr>
                    <td class="text-bold">{{ ucfirst($label) }}</td>
                    <td class="font-mono text-orange text-bold">{{ $record['calculated_time'] }}</td>
                    <td class="font-mono">{{ $record['pace'] }}/km</td>
                    <td>
                        {{ $record['data'] }}<br>
                        <span style="font-size: 9px; color: #888;">{{ \Illuminate\Support\Str::limit($record['based_on_activity'], 30) }}</span>
                    </td>
                </tr>
                @endif
            @endforeach
        </tbody>
    </table>
    @endif

    @if($badges->count() > 0)
    <h2>Medalhas Conquistadas ({{ $badges->count() }})</h2>
    <table>
        <thead>
            <tr>
                <th width="40%">Medalha</th>
                <th width="20%">Categoria</th>
                <th width="20%">Nível</th>
                <th width="20%" class="text-right">Conquistado em</th>
            </tr>
        </thead>
        <tbody>
            @foreach($badges as $badge)
            <tr>
                <<td class="text-bold">{{ __('badge_' . $badge->identifier) }}</td>
                <td style="text-transform: capitalize;">{{ $badge->category }}</td>
                <td>
                    <span class="badge-tier tier-{{ $badge->tier }}">
                        {{ $badge->tier }}
                    </span>
                </td>
                <td class="text-right font-mono">
                    {{ \Carbon\Carbon::parse($badge->pivot->awarded_at)->format('d/m/Y') }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if($goal)
    <h2>Objetivo Atual</h2>
    <table style="margin-bottom: 20px;">
        <tr>
            <th width="30%">Prova</th>
            <th width="20%">Data</th>
            <th width="15%">Distância</th>
            <th width="15%">Meta Semanal</th>
            <th width="20%">Status</th>
        </tr>
        <tr>
            <td><strong>{{ $goal->name }}</strong><br><span style="font-size: 9px; color: #666;">{{ $goal->location }}</span></td>
            <td>{{ $goal->race_date->format('d/m/Y') }}</td>
            <td>{{ $goal->race_distance }} km</td>
            <td>{{ $goal->weekly_goal_km }} km/sem</td>
            <td>
                @if(now()->diffInDays($goal->race_date, false) > 0)
                    <span style="color: #FC4C02; font-weight: bold;">Em progresso</span>
                @else
                    <span style="color: green; font-weight: bold;">Concluído</span>
                @endif
            </td>
        </tr>
    </table>
    @endif

    <div style="page-break-before: always;"></div>

    <h2>Histórico Completo de Atividades</h2>
    <table>
        <thead>
            <tr>
                <th width="15%">Data</th>
                <th width="35%">Nome da Atividade</th>
                <th width="15%" class="text-right">Distância</th>
                <th width="15%" class="text-right">Tempo</th>
                <th width="10%" class="text-right">Pace</th>
                <th width="10%" class="text-right">Watts</th>
            </tr>
        </thead>
        <tbody>
            @foreach($activities as $run)
            <tr>
                <td>{{ $run->start_date_local->format('d/m/Y') }}<br><span style="font-size: 9px; color: #888;">{{ $run->start_date_local->format('H:i') }}</span></td>
                <td>{{ \Illuminate\Support\Str::limit($run->name, 40) }}</td>
                <td class="text-right"><strong>{{ $run->distance_km }}</strong> km</td>
                <td class="text-right font-mono">{{ $run->time_formatted }}</td>
                <td class="text-right font-mono text-orange">{{ $run->pace_formatted }}</td>
                <td class="text-right">{{ $run->average_watts ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Documento gerado automaticamente pelo Run Tracker. Os dados apresentados são sincronizados via Strava API.
    </div>

</body>
</html>