'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { modelService } from '@/services/models';
import { AiModel, ModelMetric } from '@/types/models';
import { 
    RadarChart, 
    PolarGrid, 
    PolarAngleAxis, 
    PolarRadiusAxis, 
    Radar, 
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

interface ComparisonData {
    characteristic: string;
    [key: string]: string | number;
}

export default function ComparePage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [selectedModels, setSelectedModels] = useState<number[]>([]);
    const [metricsData, setMetricsData] = useState<Record<number, ModelMetric[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await modelService.getModels();
                setModels(response.data);
            } catch (err) {
                console.error('Error fetching models:', err);
                setError('Error al cargar los modelos');
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const handleModelSelect = async (modelId: number) => {
        if (selectedModels.includes(modelId)) {
            setSelectedModels(selectedModels.filter(id => id !== modelId));
            const newMetricsData = { ...metricsData };
            delete newMetricsData[modelId];
            setMetricsData(newMetricsData);
        } else if (selectedModels.length < 3) {
            setSelectedModels([...selectedModels, modelId]);
            try {
                const metrics = await modelService.getModelMetrics(modelId);
                setMetricsData(prev => ({
                    ...prev,
                    [modelId]: metrics as ModelMetric[]
                }));
            } catch (err) {
                console.error('Error fetching metrics:', err);
                setError('Error al cargar las métricas');
            }
        }
    };

    const getComparisonData = () => {
        const allMetrics = new Set<string>();
        Object.values(metricsData).forEach(metrics => {
            metrics.forEach(metric => {
                allMetrics.add(metric.characteristic_name);
            });
        });

        return Array.from(allMetrics).map(metricName => {
            const data: ComparisonData = {
                characteristic: metricName
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
            };

            selectedModels.forEach(modelId => {
                const metric = metricsData[modelId]?.find(
                    m => m.characteristic_name === metricName
                );
                const model = models.find(m => m.model_id === modelId);
                data[model?.name || ''] = metric?.value || 0;
            });

            return data;
        });
    };

    const COLORS = ['#10B981', '#3B82F6', '#F43F5E'];

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
                <h1 className="text-3xl font-got bg-gradient-tech text-transparent bg-clip-text mb-6">
                    Comparar Modelos
                </h1>

                {error && (
                    <div className="text-got-primary bg-got-primary/10 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid gap-6">
                    <div className="card p-6">
                        <h2 className="text-xl font-got mb-4">Seleccionar Modelos (máximo 3)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {models.map(model => (
                                <button
                                    key={model.model_id}
                                    onClick={() => handleModelSelect(model.model_id)}
                                    className={`p-4 rounded-lg border transition-colors ${
                                        selectedModels.includes(model.model_id)
                                            ? 'border-got-tech bg-got-tech/10'
                                            : 'border-got-light-border dark:border-got-dark-border hover:border-got-tech'
                                    }`}
                                >
                                    <h3 className="font-got text-lg">{model.name}</h3>
                                    <p className="text-sm text-got-light-text dark:text-got-dark-text">
                                        {model.developer}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedModels.length > 0 && (
                        <div className="card p-6">
                            <h2 className="text-xl font-got mb-4">Comparación de Métricas</h2>
                            <div className="h-[600px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={getComparisonData()}>
                                        <PolarGrid />
                                        <PolarAngleAxis
                                            dataKey="characteristic"
                                            tick={{ fill: 'currentColor', fontSize: 12 }}
                                        />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        {selectedModels.map((modelId, index) => {
                                            const model = models.find(m => m.model_id === modelId);
                                            if (!model?.name) return null;
                                            return (
                                                <Radar
                                                    key={modelId}
                                                    name={model.name}
                                                    dataKey={model.name}
                                                    stroke={COLORS[index]}
                                                    fill={COLORS[index]}
                                                    fillOpacity={0.6}
                                                />
                                            );
                                        })}
                                        <Tooltip />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
} 