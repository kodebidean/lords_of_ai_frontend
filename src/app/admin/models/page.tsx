'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/common/Button';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';
import { useAuth } from '@/hooks/useAuth';
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function AdminModelsPage() {
    const router = useRouter();
    const { isAdmin } = useAuth();
    const [models, setModels] = useState<AiModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Redireccionar si no es admin
        if (!isAdmin) {
            router.push('/');
            return;
        }

        const fetchModels = async () => {
            try {
                setLoading(true);
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
    }, [isAdmin, router]);

    const handleDelete = async (modelId: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este modelo?')) {
            return;
        }

        try {
            await modelService.deleteModel(modelId);
            setModels(models.filter(model => model.model_id !== modelId));
        } catch (error) {
            console.error('Error deleting model:', error);
            alert('Error al eliminar el modelo');
        }
    };

    if (!isAdmin) {
        return null; // No renderizar nada mientras redirige
    }

    return (
        <MainLayout>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-got bg-gradient-tech text-transparent bg-clip-text">
                        Administración de Modelos
                    </h1>
                    <Button
                        onClick={() => router.push('/admin/models/new')}
                        className="flex items-center space-x-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Nuevo Modelo</span>
                    </Button>
                </div>

                {error && (
                    <div className="text-got-primary bg-got-primary/10 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {models.map(model => (
                            <div
                                key={model.model_id}
                                className="card p-6 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-xl font-got bg-gradient-tech text-transparent bg-clip-text">
                                        {model.name}
                                    </h3>
                                    <p className="text-got-light-text dark:text-got-dark-text text-sm">
                                        {model.developer} • {model.category_name}
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => router.push(`/admin/models/${model.model_id}/metrics`)}
                                        className="text-got-light-text dark:text-got-dark-text hover:text-got-tech transition-colors"
                                        title="Gestionar métricas"
                                    >
                                        <ChartBarIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => router.push(`/admin/models/${model.model_id}/edit`)}
                                        className="text-got-light-text dark:text-got-dark-text hover:text-got-tech transition-colors"
                                        title="Editar modelo"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(model.model_id)}
                                        className="text-got-light-text dark:text-got-dark-text hover:text-got-primary transition-colors"
                                        title="Eliminar modelo"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
} 