import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { AiModel } from '@/types/models';

interface RankingTableProps {
    models: AiModel[];
    category: string;
}

export const RankingTable = ({ models, category }: RankingTableProps) => {
    const router = useRouter();
    const [sortConfig, setSortConfig] = useState<{
        key: keyof AiModel;
        direction: 'asc' | 'desc';
    }>({ key: 'score', direction: 'desc' });

    const sortedModels = [...models].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? 0;
        const bValue = b[sortConfig.key] ?? 0;
        
        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key: keyof AiModel) => {
        setSortConfig({
            key,
            direction: 
                sortConfig.key === key && sortConfig.direction === 'asc' 
                    ? 'desc' 
                    : 'asc',
        });
    };

    return (
        <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-got-light-border dark:border-got-dark-border">
                <h3 className="text-xl font-got bg-gradient-tech text-transparent bg-clip-text">
                    Ranking {category}
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-got-light-bg dark:bg-got-dark-bg">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-tech uppercase tracking-wider text-got-light-text dark:text-got-dark-text">
                                Posición
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-tech uppercase tracking-wider text-got-light-text dark:text-got-dark-text">
                                Modelo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-tech uppercase tracking-wider text-got-light-text dark:text-got-dark-text cursor-pointer"
                                onClick={() => requestSort('score')}
                            >
                                <div className="flex items-center">
                                    Puntuación
                                    {sortConfig.key === 'score' && (
                                        sortConfig.direction === 'asc' 
                                            ? <ChevronUpIcon className="w-4 h-4 ml-1" />
                                            : <ChevronDownIcon className="w-4 h-4 ml-1" />
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-tech uppercase tracking-wider text-got-light-text dark:text-got-dark-text cursor-pointer"
                                onClick={() => requestSort('vote_score')}
                            >
                                <div className="flex items-center">
                                    Votos
                                    {sortConfig.key === 'vote_score' && (
                                        sortConfig.direction === 'asc' 
                                            ? <ChevronUpIcon className="w-4 h-4 ml-1" />
                                            : <ChevronDownIcon className="w-4 h-4 ml-1" />
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-got-light-border dark:divide-got-dark-border">
                        {sortedModels.map((model, index) => (
                            <tr 
                                key={model.model_id}
                                className="hover:bg-got-light-bg dark:hover:bg-got-dark-bg cursor-pointer transition-colors duration-200"
                                onClick={() => router.push(`/models/${model.model_id}`)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`
                                        inline-flex items-center justify-center w-8 h-8 rounded-full font-tech
                                        ${index < 3 ? 'bg-gradient-tech text-white' : 'bg-got-light-bg dark:bg-got-dark-bg text-got-light-text dark:text-got-dark-text'}
                                    `}>
                                        {index + 1}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="font-tech text-got-light-text dark:text-got-dark-text">
                                                {model.name}
                                            </div>
                                            <div className="text-sm text-got-light-text dark:text-got-dark-text opacity-60">
                                                {model.developer}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-tech text-got-accent">
                                        {model.score?.toFixed(1) || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-tech text-got-tech">
                                        {model.vote_score || 0}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}; 