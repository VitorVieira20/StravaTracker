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

        /* --- HEADER --- */
        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 30px 40px;
            margin: -40px -40px 30px -40px; /* Estende até às bordas */
            border-bottom: 4px solid #FC4C02;
        }
        .header-content {
            display: table;
            width: 100%;
        }
        .brand {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .brand span { color: #FC4C02; }
        .date {
            text-align: right;
            font-size: 10px;
            color: #999;
        }

        /* --- USER INFO --- */
        .user-section {
            margin-bottom: 30px;
            border-left: 4px solid #FC4C02;
            padding-left: 15px;
        }
        .user-name { font-size: 20px; font-weight: bold; color: #000; }
        .user-meta { font-size: 12px; color: #666; }

        /* --- STATS CARDS --- */
        .stats-container {
            width: 100%;
            margin-bottom: 30px;
        }
        .stat-card {
            display: inline-block;
            width: 23%;
            background-color: #f4f4f5; /* Zinc-100 */
            border: 1px solid #e4e4e7;
            border-radius: 8px;
            padding: 15px 5px;
            text-align: center;
            margin-right: 1%;
        }
        .stat-value {
            display: block;
            font-size: 18px;
            font-weight: bold;
            color: #FC4C02;
        }
        .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #52525b;
            letter-spacing: 1px;
        }

        /* --- TABLES --- */
        h2 {
            font-size: 16px;
            text-transform: uppercase;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin-top: 30px;
            color: #000;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-top: 10px;
        }
        th {
            background-color: #000000;
            color: #FC4C02;
            text-transform: uppercase;
            padding: 10px;
            text-align: left;
            font-size: 9px;
            letter-spacing: 1px;
        }
        td {
            padding: 8px 10px;
            border-bottom: 1px solid #e4e4e7;
            color: #333;
        }
        tr:nth-child(even) { background-color: #fafafa; }
        
        /* Helpers */
        .text-right { text-align: right; }
        .font-mono { font-family: 'Courier', monospace; }
        .badge {
            background: #FC4C02;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 8px;
        }

        .footer {
            position: fixed;
            bottom: 20px;
            left: 40px;
            right: 40px;
            font-size: 9px;
            text-align: center;
            color: #a1a1aa;
            border-top: 1px solid #e4e4e7;
            padding-top: 10px;
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

    <h2>Histórico de Atividades</h2>
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
                <td>{{ $run->name }}</td>
                <td class="text-right"><strong>{{ $run->distance_km }}</strong> km</td>
                <td class="text-right font-mono">{{ $run->time_formatted }}</td>
                <td class="text-right font-mono" style="color: #FC4C02;">{{ $run->pace_formatted }}</td>
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