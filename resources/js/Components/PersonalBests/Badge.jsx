import { Trophy, Zap, Mountain, Rabbit, Star, Shield, Award, Wind } from 'lucide-react';

const badgeIcons = {
    'sprint': <Rabbit size={24} className="text-yellow-400" />,
    'fast-mile': <Wind size={24} className="text-blue-400" />,
    'mile-master': <Star size={24} className="text-green-400" />,
    'five-k': <Trophy size={24} className="text-red-400" />,
    'ten-k': <Award size={24} className="text-purple-400" />,
    'half-marathon': <Shield size={24} className="text-orange-400" />,
    'marathon': <Mountain size={24} className="text-gray-400" />,
    'ultra-50': <Zap size={24} className="text-teal-400" />,
    'ultra-100': <Zap size={24} className="text-indigo-400" />,
};

export default function Badge({ type }) {
    return (
        <div className="w-12 h-12 rounded-full bg-[#37373a] flex items-center justify-center shadow-inner">
            {badgeIcons[type] || <Star size={24} className="text-gray-500" />}
        </div>
    );
};