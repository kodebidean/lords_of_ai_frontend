'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RankingTable } from '@/components/rankings/RankingTable';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';

const categories = [
    { id: 'text', name: 'Texto' },
    { id: 'image', name: 'Imagen' },
    { id: 'video', name: 'Video' },
    { id: 'audio', name: 'Audio' },
    { id: 'code', name: 'Código' },
    { id: 'multimodal', name: 'Multimodal' },
];

export default function RankingsPage() {
    const [selectedCategory, setSelectedCategory] = useState('text');
    const [models, setModels] = useState<AiModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                setError('');
                const response = await modelService.getModels({ 
                    category: selectedCategory,
                    limit: 100
                });
                setModels(response.data);
            } catch (err) {
                setError('Error al cargar los rankings');
                console.error('Error fetching rankings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, [selectedCategory]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[600px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-got bg-gradient-tech text-transparent bg-clip-text">
                        Rankings Globales
                    </h1>
                </div>

                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`
                                    px-4 py-2 rounded-full font-tech text-sm transition-all duration-200
                                    ${selectedCategory === category.id
                                        ? 'bg-gradient-tech text-white shadow-neon'
                                        : 'bg-got-light-card dark:bg-got-dark-card text-got-light-text dark:text-got-dark-text hover:bg-got-tech/10'
                                    }
                                `}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {error ? (
                    <div className="text-center py-10 text-got-primary">
                        {error}
                    </div>
                ) : (
                    <RankingTable 
                        models={models} 
                        category={categories.find(c => c.id === selectedCategory)?.name || ''}
                    />
                )}
            </div>
        </MainLayout>
    );
} 