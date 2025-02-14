'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelCard } from '@/components/models/ModelCard';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';

export default function DashboardPage() {
    const [topModels, setTopModels] = useState<AiModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchTopModels = async () => {
        try {
            const response = await modelService.getModels({ limit: 5 });
            setTopModels(response.data);
        } catch (err) {
            setError('Error al cargar los modelos');
            console.error('Error fetching models:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topModels.map((model) => (
                                <ModelCard 
                                    key={model.model_id} 
                                    model={model}
                                    onVote={fetchTopModels}
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