import { useState, useEffect, useCallback } from 'react';
import { 
    ModelCharts, 
    ModelComparison, 
    HistoricalComparison,
    AdvancedFilters
} from '@/components/models';
import { Input, Card } from '@/components/common';
import { modelService } from '@/services/models';
import { AiModel, FilterOptions } from '@/types/models';

export default function StatisticsPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [selectedModels, setSelectedModels] = useState<AiModel[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'global' | 'individual' | 'comparison'>('global');

    const fetchModels = useCallback(async (filters?: FilterOptions) => {
        try {
            setLoading(true);
            const response = await modelService.searchModels({
                query: searchQuery,
                ...filters
            });
            setModels(response.data);
        } catch (error) {
            console.error('Error fetching models:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchModels();
    }, [fetchModels]);

    const handleModelSelect = (model: AiModel) => {
        if (selectedModels.length < 3) {
            setSelectedModels([...selectedModels, model]);
        }
    };

    const handleModelRemove = (modelId: number) => {
        setSelectedModels(selectedModels.filter(m => m.model_id !== modelId));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-got mb-8 bg-gradient-tech text-transparent bg-clip-text">
                Estadísticas de IAs
            </h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                </div>
            ) : (
                <div className="mb-8">
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setView('global')}
                            className={`px-4 py-2 rounded-md ${
                                view === 'global' ? 'bg-got-tech text-white' : 'bg-got-dark-card'
                            }`}
                        >
                            Estadísticas Globales
                        </button>
                        <button
                            onClick={() => setView('individual')}
                            className={`px-4 py-2 rounded-md ${
                                view === 'individual' ? 'bg-got-tech text-white' : 'bg-got-dark-card'
                            }`}
                        >
                            Estadísticas por Modelo
                        </button>
                        <button
                            onClick={() => setView('comparison')}
                            className={`px-4 py-2 rounded-md ${
                                view === 'comparison' ? 'bg-got-tech text-white' : 'bg-got-dark-card'
                            }`}
                        >
                            Comparación de Modelos
                        </button>
                    </div>

                    <AdvancedFilters 
                        onFilter={fetchModels}
                        onReset={() => fetchModels()}
                    />
                </div>
            )}

            {view === 'global' && (
                <div className="space-y-8">
                    <Card className="p-6">
                        <h2 className="text-xl font-got mb-6">Tendencias Globales</h2>
                        <ModelCharts models={models} />
                    </Card>
                </div>
            )}

            {view === 'individual' && (
                <div className="space-y-8">
                    <div className="mb-6">
                        <Input
                            type="text"
                            placeholder="Buscar modelo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {models.map(model => (
                            <Card 
                                key={model.model_id}
                                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleModelSelect(model)}
                            >
                                <h3 className="text-lg font-got mb-4">{model.name}</h3>
                                <ModelCharts models={[model]} />
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {view === 'comparison' && (
                <div className="space-y-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        {selectedModels.map(model => (
                            <div 
                                key={model.model_id}
                                className="flex items-center gap-2 bg-got-dark-card px-3 py-1 rounded-full"
                            >
                                <span>{model.name}</span>
                                <button 
                                    onClick={() => handleModelRemove(model.model_id)}
                                    className="text-got-primary hover:text-got-primary/80"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    {selectedModels.length > 0 && (
                        <>
                            <HistoricalComparison models={selectedModels} />
                            <ModelComparison currentModel={selectedModels[0]} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
} 