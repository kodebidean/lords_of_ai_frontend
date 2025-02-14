'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelCard } from '@/components/models/ModelCard';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [topModels, setTopModels] = useState<AiModel[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopModels = async () => {
            try {
                setIsLoading(true);
                const models = await modelService.getModels();
                const sortedModels = models
                    .sort((a: AiModel, b: AiModel) => b.score - a.score)
                    .slice(0, 6);
                setTopModels(sortedModels);
                setError(null);
            } catch (err) {
                console.error('Error fetching models:', err);
                setError('Error al cargar los modelos');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopModels();
    }, []);

    return (
        <MainLayout>
            <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Modelos Destacados
                    </h2>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            {error}
                        </div>
                    ) : topModels.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-got-dark-text">No hay modelos disponibles</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topModels.map((model) => (
                                <ModelCard 
                                    key={model.model_id} 
                                    model={model}
                                    onVote={async (score) => {
                                        // Por ahora solo log, implementaremos la funcionalidad después
                                        console.log(`Votado ${model.name} con puntuación ${score}`);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Estadísticas Generales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900">
                                Total Modelos
                            </h3>
                            <p className="mt-2 text-3xl font-bold text-indigo-600">
                                {topModels.length}
                            </p>
                        </div>
                        {/* Agregar más estadísticas según necesites */}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 