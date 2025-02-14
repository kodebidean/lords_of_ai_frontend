import { AiModel } from '@/types/models';
import { Card } from '../common/Card';
import { StarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import { modelService } from '@/services/models';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ModelCardProps {
    model: AiModel;
    onVote?: () => void;
}

export const ModelCard = ({ model, onVote }: ModelCardProps) => {
    const [isVoting, setIsVoting] = useState(false);
    const router = useRouter();

    const handleVote = async (value: 1 | -1) => {
        try {
            setIsVoting(true);
            await modelService.voteModel(model.model_id, value);
            onVote?.();
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <Card 
            className="hover:border-indigo-500 transition-all duration-200"
            onClick={() => router.push(`/models/${model.model_id}`)}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {model.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {model.developer}
                    </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {model.category}
                </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {model.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">
                        {model.score?.toFixed(1) || 'N/A'}
                    </span>
                </div>

                <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => handleVote(1)}
                        disabled={isVoting}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <ArrowUpIcon className="h-5 w-5 text-green-500" />
                    </button>
                    <span className="text-sm font-medium">
                        {model.vote_score || 0}
                    </span>
                    <button
                        onClick={() => handleVote(-1)}
                        disabled={isVoting}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <ArrowDownIcon className="h-5 w-5 text-red-500" />
                    </button>
                </div>
            </div>
        </Card>
    );
}; 