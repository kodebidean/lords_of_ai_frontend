'use client';

import { useState, useEffect } from 'react';
import { ModelComparison, ModelSearch } from '../../components/models';
import { modelService } from '../../services/models';
import { AiModel } from '../../types/models';
import { Card, Button } from '@/components/common';

interface SearchFilters {
    query?: string;
    category?: string;
    minScore?: number;
    maxDate?: string;
}

export default function ComparePage() {
    const [selectedModels, setSelectedModels] = useState<AiModel[]>([]);
    const [availableModels, setAvailableModels] = useState<AiModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        setIsLoading(true);
        try {
            const response = await modelService.getModels();
            setAvailableModels(response.data);
        } catch (error) {
            console.error('Error fetching models:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModelSelect = (model: AiModel) => {
        if (selectedModels.length < 3 && !selectedModels.find(m => m.model_id === model.model_id)) {
            setSelectedModels([...selectedModels, model]);
        }
    };

    const handleModelRemove = (modelId: number) => {
        setSelectedModels(selectedModels.filter(m => m.model_id !== modelId));
    };

    const handleSearch = async (filters: SearchFilters) => {
        setIsLoading(true);
        try {
            const response = await modelService.searchModels(filters);
            setAvailableModels(response.data);
        } catch (error) {
            console.error('Error searching models:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-got-dark-bg py-12 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-got bg-gradient-tech text-transparent bg-clip-text mb-4">
                        Comparar Modelos
                    </h1>
                    <p className="text-got-dark-text text-xl max-w-2xl mx-auto">
                        Selecciona hasta 3 modelos para comparar sus características y rendimiento
                    </p>
                </div>

                <ModelSearch onSearch={handleSearch} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {selectedModels.map(model => (
                        <Card key={model.model_id} className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => handleModelRemove(model.model_id)}
                            >
                                ✕
                            </Button>
                            <h3 className="text-xl font-got mb-2">{model.name}</h3>
                            <p className="text-got-dark-text text-sm mb-4">
                                {model.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-got-tech">
                                    {model.category.category_name}
                                </span>
                                <span className="text-got-dark-text">
                                    ⭐ {model.score}
                                </span>
                            </div>
                        </Card>
                    ))}
                    {Array.from({ length: 3 - selectedModels.length }).map((_, i) => (
                        <Card 
                            key={`empty-${i}`} 
                            className="border-2 border-dashed border-got-tech/20 flex items-center justify-center"
                        >
                            <p className="text-got-dark-text">
                                Selecciona un modelo
                            </p>
                        </Card>
                    ))}
                </div>

                {selectedModels.length > 1 && (
                    <ModelComparison currentModel={selectedModels[0]} />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-3 text-center py-8">
                            <p className="text-got-dark-text">Cargando modelos...</p>
                        </div>
                    ) : (
                        availableModels.map(model => (
                            <Card 
                                key={model.model_id}
                                className={`cursor-pointer transition-all duration-200 hover:border-got-tech
                                    ${selectedModels.find(m => m.model_id === model.model_id) 
                                        ? 'border-got-tech' 
                                        : ''}`}
                                onClick={() => handleModelSelect(model)}
                            >
                                <h3 className="text-lg font-got mb-2">{model.name}</h3>
                                <p className="text-got-dark-text text-sm mb-4 line-clamp-2">
                                    {model.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-got-tech">
                                        {model.category.category_name}
                                    </span>
                                    <span className="text-got-dark-text">
                                        ⭐ {model.score}
                                    </span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 