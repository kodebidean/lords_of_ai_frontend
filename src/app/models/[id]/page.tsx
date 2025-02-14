'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
    ModelCharacteristics, 
    ModelBenchmarks, 
    ModelVersionHistory,
    ModelDiscussion 
} from '@/components/models';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';
import { Button } from '@/components/common';
import { Card } from '@/components/common';

type TabType = 'characteristics' | 'benchmarks' | 'versions' | 'discussion';

export default function ModelDetailPage() {
    const { id } = useParams();
    const [model, setModel] = useState<AiModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('characteristics');

    useEffect(() => {
        const fetchModel = async () => {
            setIsLoading(true);
            try {
                const data = await modelService.getModelById(Number(id));
                setModel(data);
            } catch (error) {
                console.error('Error fetching model:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchModel();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-got-dark-bg flex items-center justify-center">
                <p className="text-got-dark-text">Cargando modelo...</p>
            </div>
        );
    }

    if (!model) {
        return (
            <div className="min-h-screen bg-got-dark-bg flex items-center justify-center">
                <p className="text-got-dark-text">Modelo no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-got-dark-bg py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <Card className="bg-got-light-bg/5 rounded-lg p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-got bg-gradient-tech text-transparent bg-clip-text mb-2">
                                {model.name}
                            </h1>
                            <p className="text-got-dark-text text-xl mb-4">
                                {model.developer}
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-got-tech/10 text-got-tech">
                                    {model.category.category_name}
                                </span>
                                <span className="text-got-dark-text">
                                    ⭐ {model.score}
                                </span>
                            </div>
                        </div>
                        <Button>
                            Comparar
                        </Button>
                    </div>
                    <p className="mt-6 text-got-dark-text">
                        {model.description}
                    </p>
                </Card>

                {/* Navigation Tabs */}
                <div className="border-b border-got-tech/20">
                    <nav className="flex gap-8">
                        {['characteristics', 'benchmarks', 'versions', 'discussion'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as TabType)}
                                className={`pb-4 text-sm font-medium transition-colors
                                    ${activeTab === tab 
                                        ? 'text-got-tech border-b-2 border-got-tech' 
                                        : 'text-got-dark-text hover:text-got-tech'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {activeTab === 'characteristics' && (
                        <ModelCharacteristics 
                            characteristics={model.characteristics}
                        />
                    )}

                    {activeTab === 'benchmarks' && (
                        <ModelBenchmarks 
                            benchmarks={model.benchmark_results || []}
                        />
                    )}

                    {activeTab === 'versions' && (
                        <ModelVersionHistory 
                            versions={model.versions || []}
                        />
                    )}

                    {activeTab === 'discussion' && (
                        <ModelDiscussion 
                            modelId={model.model_id}
                        />
                    )}
                </div>
            </div>
        </div>
    );
} 