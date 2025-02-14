'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';
import { 
    ModelCharacteristics,
    BenchmarkComparison,
    PerformanceMetrics
} from '@/components/models';

export default function AdvancedPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<AiModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            setLoading(true);
            const data = await modelService.getModels();
            setModels(data);
        } catch (error) {
            console.error('Error fetching models:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-got mb-8 bg-gradient-tech text-transparent bg-clip-text">
                    Características Avanzadas
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <div className="bg-got-dark-card p-6 rounded-lg">
                                <h2 className="text-xl font-got mb-4">Seleccionar Modelo</h2>
                                <div className="space-y-2">
                                    {models.map(model => (
                                        <button
                                            key={model.model_id}
                                            onClick={() => setSelectedModel(model)}
                                            className={`w-full text-left p-3 rounded-md transition-colors ${
                                                selectedModel?.model_id === model.model_id
                                                    ? 'bg-got-tech text-white'
                                                    : 'hover:bg-got-tech/10'
                                            }`}
                                        >
                                            {model.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {selectedModel ? (
                                <div className="space-y-6">
                                    <ModelCharacteristics model={selectedModel} />
                                    <BenchmarkComparison model={selectedModel} />
                                    <PerformanceMetrics model={selectedModel} />
                                </div>
                            ) : (
                                <div className="bg-got-dark-card p-6 rounded-lg text-center">
                                    <p className="text-got-dark-text">
                                        Selecciona un modelo para ver sus características avanzadas
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
} 