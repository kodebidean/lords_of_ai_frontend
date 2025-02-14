import { useState } from 'react';
import Link from 'next/link';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Props {
    model: AiModel;
    onVote: (score: number) => Promise<void>;
}

export const ModelCard = ({ model, onVote }: Props) => {
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async (value: 1 | -1) => {
        try {
            setIsVoting(true);
            await modelService.voteModel(model.model_id, value);
            onVote(value);
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <Card className="hover:border-got-tech/50 transition-all duration-200">
            <div className="flex justify-between">
                <div>
                    <Link 
                        href={`/models/${model.model_id}`}
                        className="text-xl font-got bg-gradient-tech text-transparent bg-clip-text hover:opacity-80"
                    >
                        {model.name}
                    </Link>
                    <p className="text-sm text-got-light-text dark:text-got-dark-text">
                        {model.developer}
                    </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-got-tech/10 text-got-tech">
                    {model.category.category_name}
                </span>
            </div>

            <p className="mt-4 text-sm text-got-light-text dark:text-got-dark-text line-clamp-2">
                {model.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                    <Button
                        onClick={() => handleVote(1)}
                        disabled={isVoting}
                        variant="outline"
                        size="sm"
                    >
                        <ArrowUpIcon className="h-5 w-5 text-green-500" />
                    </Button>
                    <Button
                        onClick={() => handleVote(-1)}
                        disabled={isVoting}
                        variant="outline"
                        size="sm"
                    >
                        <ArrowDownIcon className="h-5 w-5 text-red-500" />
                    </Button>
                </div>
                <div className="text-sm text-got-light-text dark:text-got-dark-text">
                    Score: {model.vote_score || 0}
                </div>
            </div>
        </Card>
    );
}; 