'use client';

import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelCard } from '@/components/models/ModelCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';

const ITEMS_PER_PAGE = 9;

export default function ModelsPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchModels = useCallback(async () => {
        try {
            setLoading(true);
            const response = await modelService.getModels({
                category: category || undefined,
                page,
                limit: ITEMS_PER_PAGE
            });
            setModels(response.data);
        } catch (err) {
            setError('Error al cargar los modelos');
            console.error('Error fetching models:', err);
        } finally {
            setLoading(false);
        }
    }, [category, page]);

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

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">
                        {error}
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