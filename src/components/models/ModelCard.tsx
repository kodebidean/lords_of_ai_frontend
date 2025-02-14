import { AiModel } from '@/types/models';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { modelService } from '@/services/models';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ModelCardProps {
    model: AiModel;
    onVote?: () => void;
}

export const ModelCard = ({ model, onVote }: ModelCardProps) => {
    const router = useRouter();
    const [isVoting, setIsVoting] = useState(false);
    const [localLikes, setLocalLikes] = useState(model.likes || 0);
    const [localDislikes, setLocalDislikes] = useState(model.dislikes || 0);

    const handleVote = async (voteType: 'like' | 'dislike') => {
        if (isVoting) return;
        
        try {
            setIsVoting(true);
            const voteValue = voteType === 'like' ? 1 : -1;
            await modelService.voteModel(model.model_id, voteValue);
            
            // Actualizar contadores locales
            if (voteType === 'like') {
                setLocalLikes(prev => prev + 1);
            } else {
                setLocalDislikes(prev => prev + 1);
            }
            
            onVote?.();
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="card hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-got bg-gradient-tech text-transparent bg-clip-text">
                            {model.name}
                        </h3>
                        <p className="text-got-light-text dark:text-got-dark-text text-sm mt-1">
                            {model.developer}
                        </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-tech bg-got-tech/10 text-got-tech">
                        {model.category_name}
                    </span>
                </div>

                <p className="mt-4 text-got-light-text dark:text-got-dark-text line-clamp-2">
                    {model.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleVote('like')}
                            disabled={isVoting}
                            className={`flex items-center space-x-1 text-got-light-text dark:text-got-dark-text hover:text-got-tech transition-colors ${
                                isVoting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <HandThumbUpIcon className="h-5 w-5" />
                            <span className="font-tech">{localLikes}</span>
                        </button>
                        <button
                            onClick={() => handleVote('dislike')}
                            disabled={isVoting}
                            className={`flex items-center space-x-1 text-got-light-text dark:text-got-dark-text hover:text-got-primary transition-colors ${
                                isVoting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <HandThumbDownIcon className="h-5 w-5" />
                            <span className="font-tech">{localDislikes}</span>
                        </button>
                    </div>
                    <button
                        onClick={() => router.push(`/statistics/${model.model_id}`)}
                        className="text-sm font-tech text-got-tech hover:text-got-tech/80 transition-colors"
                    >
                        Ver Estadísticas →
                    </button>
                </div>
            </div>
        </div>
    );
}; 