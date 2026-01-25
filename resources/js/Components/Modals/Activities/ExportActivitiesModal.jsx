import { X, Download, FileText, FileSpreadsheet, FileJson, Table, Calendar } from 'lucide-react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

export default function ExportActivitiesModal({ onClose, filters = {} }) {
    const { t } = useTranslation();
    
    const [selectedColumns, setSelectedColumns] = useState([
        'start_date_local', 'name', 'distance', 'moving_time', 'average_speed'
    ]);

    const [format, setFormat] = useState('csv');
    const [fromDate, setFromDate] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const columns = [
        { id: 'start_date_local', label: t('export_col_date') || 'Data' },
        { id: 'name', label: t('export_col_name') || 'Nome' },
        { id: 'distance', label: t('export_col_dist') || 'Distância' },
        { id: 'moving_time', label: t('export_col_time') || 'Tempo' },
        { id: 'elapsed_time', label: t('export_col_elapsed') || 'Tempo Decorrido' },
        { id: 'total_elevation_gain', label: t('export_col_elev') || 'Elevação' },
        { id: 'average_speed', label: t('export_col_pace') || 'Ritmo Médio' },
        { id: 'calories', label: t('export_col_cal') || 'Calorias' },
        { id: 'average_heartrate', label: t('export_col_hr') || 'Batimentos Card.' },
    ];

    const formats = [
        { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
        { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-500' },
        { id: 'csv', label: 'CSV', icon: Table, color: 'text-blue-500' },
        { id: 'json', label: 'JSON', icon: FileJson, color: 'text-yellow-500' },
    ];

    const toggleColumn = (id) => {
        if (selectedColumns.includes(id)) {
            if (selectedColumns.length > 1) {
                setSelectedColumns(selectedColumns.filter(c => c !== id));
            }
        } else {
            setSelectedColumns([...selectedColumns, id]);
        }
    };

    const handleExport = () => {
        setIsExporting(true);
        const params = new URLSearchParams();
        
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        
        params.append('format', format);
        if (fromDate) params.append('from_date', fromDate);
        selectedColumns.forEach(col => params.append('columns[]', col));

        const url = `/activities/export?${params.toString()}`;
        window.location.href = url;

        setTimeout(() => {
            setIsExporting(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#18181b] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
                
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#27272a]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Download className="text-[#FC4C02]" size={24} />
                        {t('export_title') || "Exportar Atividades"}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                            {t('export_format_label') || "Formato do Arquivo"}
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {formats.map((fmt) => (
                                <button
                                    key={fmt.id}
                                    onClick={() => setFormat(fmt.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer
                                        ${format === fmt.id 
                                            ? 'bg-[#27272a] border-[#FC4C02] ring-1 ring-[#FC4C02] shadow-lg shadow-orange-900/20' 
                                            : 'bg-[#27272a]/50 border-gray-700 hover:border-gray-500 hover:bg-[#27272a]'}
                                    `}
                                >
                                    <fmt.icon className={`mb-2 ${format === fmt.id ? fmt.color : 'text-gray-400'}`} size={24} />
                                    <span className={`text-xs font-bold ${format === fmt.id ? 'text-white' : 'text-gray-400'}`}>
                                        {fmt.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                            {t('export_date_from') || "A partir de"}
                        </h3>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input
                                type="date"
                                className="w-full bg-[#27272a]/50 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#FC4C02] focus:ring-0 placeholder-gray-500 transition-all focus:bg-[#27272a] cursor-pointer"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                            {t('export_cols_label') || "Colunas"}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                            {columns.map((col) => (
                                <div 
                                    key={col.id}
                                    onClick={() => toggleColumn(col.id)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-[#27272a]/50 border border-gray-700 cursor-pointer hover:bg-[#27272a] transition-colors"
                                >
                                    <div className={`
                                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${selectedColumns.includes(col.id) 
                                            ? 'bg-[#FC4C02] border-[#FC4C02]' 
                                            : 'border-gray-600 bg-transparent'}
                                    `}>
                                        {selectedColumns.includes(col.id) && <span className="text-white text-xs">✓</span>}
                                    </div>
                                    <span className="text-sm text-gray-300">{col.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="p-6 pt-0 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold bg-[#27272a] text-gray-400 hover:text-white hover:bg-[#323236] transition-colors cursor-pointer"
                    >
                        {t('cancel') || "Cancelar"}
                    </button>
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold bg-[#FC4C02] text-white hover:bg-[#e34402] transition-colors shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isExporting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Download size={20} />
                                {t('export_btn') || "Exportar"}
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
