'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';

export default function RankingsPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            setLoading(true);
            const data = await modelService.getModels();
            setModels(data || []);
        } catch (error) {
            console.error('Error fetching models:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredModels = () => {
        if (!models) return [];
        return selectedCategory === 'all'
            ? models
            : models.filter(model => model.category?.category_name === selectedCategory);
    };

    const getRankingData = () => {
        const filteredModels = getFilteredModels();
        return filteredModels
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .map((model, index) => ({
                ...model,
                position: index + 1,
                totalScore: model.score || 0,
                trend: Math.random() > 0.5 ? 'up' : 'down' // Esto debería venir de la base de datos
            }));
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-got mb-8 bg-gradient-tech text-transparent bg-clip-text">
                    Rankings Globales
                </h1>

                <div className="mb-6">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 rounded-lg bg-got-dark-card border border-got-dark-border focus:border-got-tech"
                    >
                        <option value="all">Todas las categorías</option>
                        <option value="text">Texto</option>
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                    </div>
                ) : (
                    <div className="bg-got-dark-card rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-got-dark-bg">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-got-dark-text uppercase tracking-wider">
                                        Posición
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-got-dark-text uppercase tracking-wider">
                                        Modelo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-got-dark-text uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-got-dark-text uppercase tracking-wider">
                                        Puntuación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-got-dark-text uppercase tracking-wider">
                                        Tendencia
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-got-dark-border">
                                {getRankingData().map((model) => (
                                    <tr 
                                        key={model.model_id}
                                        className="hover:bg-got-dark-bg transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {model.position <= 3 ? (
                                                    <TrophyIcon 
                                                        className={`h-5 w-5 mr-2 ${
                                                            model.position === 1 ? 'text-yellow-400' :
                                                            model.position === 2 ? 'text-gray-400' :
                                                            'text-amber-600'
                                                        }`}
                                                    />
                                                ) : (
                                                    <span className="w-8 text-center">{model.position}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-got-light-text">
                                                    {model.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-got-tech/10 text-got-tech">
                                                {model.category?.category_name || 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                                                <span>{model.totalScore.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                model.trend === 'up' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {model.trend === 'up' ? '↑' : '↓'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-got-dark-card p-6 rounded-lg">
                        <h3 className="text-lg font-got mb-4">Top Puntuación</h3>
                        <div className="text-3xl font-bold text-got-tech">
                            {Math.max(...(models?.map(m => m.score || 0) || [0])).toFixed(1)}
                        </div>
                    </div>
                    <div className="bg-got-dark-card p-6 rounded-lg">
                        <h3 className="text-lg font-got mb-4">Promedio Global</h3>
                        <div className="text-3xl font-bold text-got-tech">
                            {(models?.reduce((acc, m) => acc + (m.score || 0), 0) / (models?.length || 1)).toFixed(1)}
                        </div>
                    </div>
                    <div className="bg-got-dark-card p-6 rounded-lg">
                        <h3 className="text-lg font-got mb-4">Total Modelos</h3>
                        <div className="text-3xl font-bold text-got-tech">
                            {models?.length || 0}
                        </div>
                    </div>
                    <div className="bg-got-dark-card p-6 rounded-lg">
                        <h3 className="text-lg font-got mb-4">Categorías</h3>
                        <div className="text-3xl font-bold text-got-tech">
                            {new Set(models?.map(m => m.category?.category_name)).size}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 