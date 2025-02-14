'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelCard } from '@/components/models/ModelCard';
import { ModelMetricsChart } from '@/components/statistics/ModelMetricsChart';
import { ScoreEvolutionChart } from '@/components/statistics/ScoreEvolutionChart';
import { CategoryDistributionChart } from '@/components/statistics/CategoryDistributionChart';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';
import { ModelMetric } from '@/types/models';

export default function ModelStatisticsPage() {
    const { id } = useParams();
    const [model, setModel] = useState<AiModel | null>(null);
    const [metrics, setMetrics] = useState<ModelMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchModelData = async () => {
            try {
                setLoading(true);
                const [modelData, metricsData] = await Promise.all([
                    modelService.getModelById(Number(id)),
                    modelService.getModelMetrics(Number(id))
                ]);
                setModel(modelData);
                setMetrics(metricsData);
            } catch (err) {
                setError('Error al cargar los datos del modelo');
                console.error('Error fetching model data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchModelData();
        }
    }, [id]);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[600px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                </div>
            </MainLayout>
        );
    }

    if (error || !model) {
        return (
            <MainLayout>
                <div className="text-center py-10 text-got-primary">
                    {error || 'Modelo no encontrado'}
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="py-6">
                <h1 className="text-3xl font-got bg-gradient-tech text-transparent bg-clip-text mb-6">
                    Estadísticas de {model.name}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                        <ModelCard model={model} onVote={() => {}} />
                    </div>
                    
                    <ModelMetricsChart metrics={metrics} />
                    <ScoreEvolutionChart data={model.score_history || []} />
                    
                    <div className="lg:col-span-2">
                        <CategoryDistributionChart 
                            data={[
                                { name: 'Likes', value: model.likes || 0 },
                                { name: 'Dislikes', value: model.dislikes || 0 }
                            ]} 
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 