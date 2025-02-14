import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/common';
import { modelService } from '@/services/models';
import { AiModel, Category } from '@/types/models';
import { TrophyIcon, HeartIcon } from '@heroicons/react/24/solid';

export default function RankingsPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'likes' | 'score'>('likes');

    const fetchModels = useCallback(async () => {
        try {
            const response = await modelService.getModels({
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                sort: sortBy,
                order: 'desc'
            });
            setModels(response);
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    }, [selectedCategory, sortBy]);

    useEffect(() => {
        fetchModels();
        fetchCategories();
    }, [selectedCategory, sortBy, fetchModels]);

    const fetchCategories = async () => {
        try {
            const response = await modelService.getCategories();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-got mb-8 bg-gradient-tech text-transparent bg-clip-text">
                Rankings Globales
            </h1>

            <div className="mb-8 flex gap-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-md border-gray-300"
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                        <option key={category.category_id} value={category.category_name}>
                            {category.category_name}
                        </option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'likes' | 'score')}
                    className="rounded-md border-gray-300"
                >
                    <option value="likes">Por likes</option>
                    <option value="score">Por puntuación</option>
                </select>
            </div>

            <div className="space-y-4">
                {models.map((model, index) => (
                    <Card key={model.model_id} className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-got-tech">
                                    #{index + 1}
                                </span>
                                <div>
                                    <h3 className="text-lg font-got">{model.name}</h3>
                                    <p className="text-sm text-got-dark-text">
                                        {model.category.category_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <HeartIcon className="h-5 w-5 text-red-500" />
                                    <span>{model.likes || 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrophyIcon className="h-5 w-5 text-yellow-400" />
                                    <span>{model.score.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 