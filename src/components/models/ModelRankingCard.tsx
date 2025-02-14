import { ModelRanking } from '@/types/models';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface ModelRankingCardProps {
    ranking: ModelRanking;
}

export const ModelRankingCard = ({ ranking }: ModelRankingCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ranking en {ranking.category}</h3>
                <TrophyIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Posición</span>
                    <span className="text-2xl font-bold text-indigo-600">#{ranking.rank}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Puntuación</span>
                    <span className="text-lg font-semibold">{ranking.score.toFixed(1)}</span>
                </div>
            </div>
        </div>
    );
}; 