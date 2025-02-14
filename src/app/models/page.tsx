'use client';

import { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelCard } from '@/components/models/ModelCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';

const ITEMS_PER_PAGE = 9;

export default function ModelsPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchModels = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchModels();
    }, [fetchModels]);

    const filteredModels = models.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Modelos de IA
                    </h1>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <Input
                        type="text"
                        placeholder="Buscar modelos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Todas las categorías</option>
                        <option value="text">Texto</option>
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="code">Código</option>
                        <option value="multimodal">Multimodal</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">
                        {error}
                    </div>
                ) : filteredModels.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No se encontraron modelos</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredModels.map((model) => (
                                <ModelCard 
                                    key={model.model_id} 
                                    model={model}
                                    onVote={fetchModels}
                                />
                            ))}
                        </div>

                        <div className="mt-6 flex justify-center space-x-4">
                            <Button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                variant="outline"
                            >
                                Anterior
                            </Button>
                            <Button
                                onClick={() => setPage(p => p + 1)}
                                disabled={models.length < ITEMS_PER_PAGE}
                                variant="outline"
                            >
                                Siguiente
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
} 