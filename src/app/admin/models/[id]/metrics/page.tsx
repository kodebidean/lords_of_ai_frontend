'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelMetricsForm } from '@/components/models/ModelMetricsForm';
import { ModelMetricsChart } from '@/components/statistics/ModelMetricsChart';
import { modelService } from '@/services/models';
import { useAuth } from '@/hooks/useAuth';
import { ModelMetric } from '@/types/models';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function ModelMetricsPage() {
    const router = useRouter();
    const { id } = useParams();
    const { isAdmin } = useAuth();
    const [metrics, setMetrics] = useState<ModelMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
            return;
        }

        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await modelService.getModelMetrics(Number(id));
                setMetrics(data as ModelMetric[]);
            } catch (err) {
                console.error('Error fetching metrics:', err);
                setError('Error al cargar las métricas');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMetrics();
        }
    }, [id, isAdmin, router]);

    const handleAddMetric = async (metricData: Omit<ModelMetric, 'characteristic_id' | 'model_id' | 'created_at'>) => {
        const newMetric = await modelService.addModelMetrics(Number(id), metricData);
        setMetrics([...metrics, newMetric]);
    };

    const handleDeleteMetric = async (metricId: number) => {
        await modelService.deleteModelMetrics(Number(id), metricId);
        setMetrics(metrics.filter(metric => metric.characteristic_id !== metricId));
    };

    if (!isAdmin) return null;

    return (
        <MainLayout>
            <div className="py-6">
                {error && (
                    <div className="text-got-primary bg-got-primary/10 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}
                <h1 className="text-3xl font-got bg-gradient-tech text-transparent bg-clip-text mb-6">
                    Gestionar Métricas
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h2 className="text-xl font-got mb-4">Añadir Nueva Métrica</h2>
                        <ModelMetricsForm 
                            onSubmit={handleAddMetric} 
                        />
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-got mb-4">Métricas Actuales</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-[200px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                            </div>
                        ) : metrics.length > 0 ? (
                            <div className="space-y-4">
                                {metrics.map(metric => (
                                    <div 
                                        key={metric.characteristic_id} 
                                        className="flex justify-between items-center p-3 bg-got-light-bg/50 dark:bg-got-dark-bg/50 rounded-lg"
                                    >
                                        <div>
                                            <span className="font-medium">{metric.characteristic_name}</span>
                                            <span className="ml-2 text-got-light-text dark:text-got-dark-text">
                                                {metric.value}%
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteMetric(metric.characteristic_id)}
                                            className="text-got-light-text dark:text-got-dark-text hover:text-got-primary transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-got-light-text dark:text-got-dark-text">
                                No hay métricas registradas
                            </p>
                        )}
                    </div>

                    {metrics.length > 0 && (
                        <div className="lg:col-span-2">
                            <ModelMetricsChart metrics={metrics} />
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
} 