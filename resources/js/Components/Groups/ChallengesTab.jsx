import { Plus, Trophy } from "lucide-react";
import ChallengeCard from "./ChallengeCard";

export default function ChallengesTab({ auth, t, challenges, canCreateChallenge, setIsChallengeModalOpen }) {

    return (
        <div>
            {canCreateChallenge &&
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{t('groups_active_challenges_title')}</h2>
                    <button
                        onClick={() => setIsChallengeModalOpen(true)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <Plus size={16} /> {t('groups_new_challenge')}
                    </button>
                </div>
            }

            {challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map(challenge => (
                        <ChallengeCard key={challenge.id} auth={auth} challenge={challenge} />
                    ))}
                </div>
            ) : (
                <div className="bg-[#27272a] rounded-3xl p-12 text-center border border-gray-800 text-gray-500">
                    <Trophy size={48} className="mx-auto mb-4 opacity-30" />
                    <p>{t('groups_no_challenges')}</p>
                </div>
            )}
        </div>
    );
}