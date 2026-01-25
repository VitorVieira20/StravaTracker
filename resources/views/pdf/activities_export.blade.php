<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Exportação de Atividades</title>
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
        
        h2 {
            font-size: 16px; text-transform: uppercase; border-bottom: 2px solid #000;
            padding-bottom: 5px; margin-bottom: 20px; color: #000;
        }

        table { width: 100%; border-collapse: collapse; font-size: 10px; }
        th {
            background-color: #000000; color: #FC4C02; text-transform: uppercase;
            padding: 6px 8px; text-align: left; font-size: 9px; letter-spacing: 1px;
        }
        td { padding: 6px 8px; border-bottom: 1px solid #e4e4e7; color: #333; }
        tr:nth-child(even) { background-color: #fafafa; }
        
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
                <div style="font-size: 10px; color: #ccc;">EXPORTAÇÃO DE ATIVIDADES</div>
            <div style="font-size: 10px; color: #FC4C02;">{{ date('d/m/Y H:i') }}</div>
            </div>
        </div>
    </div>

    <h2>Listagem de Atividades</h2>

    <table>
        <thead>
            <tr>
                @foreach($columns as $col)
                    <th>{{ ucwords(str_replace('_', ' ', $col)) }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
            <tr>
                @foreach($columns as $col)
                    <td>{{ $row[$col] }}</td>
                @endforeach
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Documento gerado pelo Run Tracker. {{ count($data) }} atividades listadas.
    </div>

</body>
</html>
