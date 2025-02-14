'use client';

import { useState, useEffect } from 'react';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';
import { MainLayout } from '@/components/layout/MainLayout';

export default function StatisticsPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setIsLoading(true);
                const data = await modelService.getModels();
                setModels(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error fetching models:', err);
                setError('Error al cargar los modelos');
                setModels([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchModels();
    }, []);

    const categoryStats = (models || []).reduce((acc, model) => {
        const categoryName = model.category?.category_name || 'Sin categoría';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <MainLayout>
            <div className="py-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Estadísticas
                </h1>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Modelos por Categoría
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(categoryStats).map(([category, count]) => (
                                    <div key={category} className="flex justify-between items-center">
                                        <span className="text-gray-600">{category}</span>
                                        <span className="text-indigo-600 font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Estadísticas Generales
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total de Modelos</span>
                                    <span className="text-indigo-600 font-semibold">{models.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
} 