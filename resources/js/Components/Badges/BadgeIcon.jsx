import { Sunrise, Moon, Flame, Star } from 'lucide-react';

export default function BadgeIcon({ badge, size = "md", locked = false }) {
    
    const sizes = {
        sm: "w-10 h-10 text-[8px]",
        md: "w-20 h-20 text-xs",
        lg: "w-32 h-32 text-sm",
    };

    const tierColors = {
        bronze:   { main: "#C2410C", light: "#EA580C", dark: "#7C2D12", text: "#FFF7ED" },
        silver:   { main: "#475569", light: "#64748B", dark: "#1E293B", text: "#F8FAFC" },
        gold:     { main: "#D97706", light: "#F59E0B", dark: "#92400E", text: "#FFFBEB" },
        platinum: { main: "#1E40AF", light: "#3B82F6", dark: "#172554", text: "#EFF6FF" },
    };

    const colors = tierColors[badge.tier] || tierColors.bronze;
    const filter = locked ? "grayscale opacity-50 contrast-75" : "drop-shadow-xl";


    const renderHexagon = () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 98 L6.7 73 L6.7 27 L50 2 L93.3 27 L93.3 73 Z" fill={colors.dark} />
            <path d="M50 95 L10 72 V28 L50 5 V95 Z" fill={colors.main} />
            <path d="M50 95 L90 72 V28 L50 5 V95 Z" fill={colors.light} />
        </svg>
    );

    const renderSquare = () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="5" y="5" width="90" height="90" rx="4" fill={colors.dark} />
            <path d="M5 50 H95 V91 A4 4 0 0 1 91 95 H9 A4 4 0 0 1 5 91 Z" fill={colors.main} />
            <path d="M5 9 A4 4 0 0 1 9 5 H91 A4 4 0 0 1 95 9 V50 H5 Z" fill={colors.light} />
            <path d="M55 5 L95 5 L95 45 Z" fill="white" fillOpacity="0.2" />
        </svg>
    );

    const renderCircle = () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill={colors.dark} />
            <circle cx="50" cy="50" r="40" fill={colors.main} />
            <path d="M50 50 L50 10 A40 40 0 0 1 90 50 Z" fill={colors.light} />
            <path d="M50 50 L50 90 A40 40 0 0 1 10 50 Z" fill={colors.light} />
            <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
        </svg>
    );

    const renderDiamond = () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 5 L95 50 L50 95 L5 50 Z" fill={colors.dark} />
            <path d="M50 5 L50 95 L5 50 Z" fill={colors.main} />
            <path d="M50 5 L95 50 L50 95 Z" fill={colors.light} />
            <path d="M50 5 L72 27 L50 35 L28 27 Z" fill="white" fillOpacity="0.3" />
        </svg>
    );

    const renderShield = () => (
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 95 C20 85 5 65 5 25 L50 5 L95 25 C95 65 80 85 50 95 Z" fill={colors.main} />
            <path d="M50 5 L95 25 C95 65 80 85 50 95 V5 Z" fill={colors.light} />
            <path d="M50 5 L50 40 L95 25 Z" fill="white" fillOpacity="0.2" />
        </svg>
    );

    const getShape = () => {
        switch (badge.category) {
            case 'distance': return renderHexagon();
            case 'total':    return renderSquare();
            case 'elevation': return renderDiamond();
            case 'streak':   return renderShield();
            case 'special':  return renderCircle();
            default:         return renderCircle();
        }
    };

    const renderContent = () => {
        const iconSize = "45%";
        const commonClasses = "absolute inset-0 flex flex-col items-center justify-center drop-shadow-md z-10";

        if (badge.identifier === 'early_bird') 
            return <div className={commonClasses}><Sunrise size={iconSize} color="white" strokeWidth={2.5} /></div>;
        if (badge.identifier === 'night_owl') 
            return <div className={commonClasses}><Moon size={iconSize} color="white" strokeWidth={2.5} /></div>;
        if (badge.category === 'calories') 
            return <div className={commonClasses}><Flame size={iconSize} color="white" strokeWidth={2.5} /></div>;
        if (badge.identifier === 'first_activity')
            return <div className={commonClasses}><Star size={iconSize} color="white" fill="white" /></div>;

        let mainText = "";
        let subText = "";

        const parts = badge.identifier.split('_');
        const val = parts[1] || "";

        if (badge.category === 'streak') {
            mainText = val.replace(/[^0-9]/g, ''); // "3"
            subText = "DIAS";
        } else if (badge.identifier === 'dist_21k' || badge.identifier === 'half_marathon') {
            mainText = "21.1";
            subText = "KM";
        } else if (badge.identifier === 'dist_42k') {
            mainText = "42.2";
            subText = "KM";
        } else {
            mainText = val.toUpperCase().replace('K', '').replace('M', ''); // "10" de "10k"
            if (val.includes('k')) subText = "KM";
            else if (val.includes('m') && badge.category === 'time') subText = "MIN";
            else if (val.includes('h')) subText = "HORAS";
            else subText = "METROS";
        }

        return (
            <div className={commonClasses} style={{ color: colors.text }}>
                <span className="text-[2.2em] font-black leading-none tracking-tighter" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {mainText}
                </span>
                {subText && (
                    <span className="text-[0.65em] font-bold opacity-90 tracking-widest mt-0.5">
                        {subText}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className={`relative ${sizes[size]} ${filter} transition-transform duration-300 hover:scale-105 group select-none`}>
            {getShape()}
            {renderContent()}
            
            {!locked && (
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
        </div>
    );
}