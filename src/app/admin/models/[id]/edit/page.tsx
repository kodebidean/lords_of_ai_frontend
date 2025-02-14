'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelForm } from '@/components/models/ModelForm';
import { modelService } from '@/services/models';
import { useAuth } from '@/hooks/useAuth';
import { AiModel } from '@/types/models';

export default function EditModelPage() {
    const router = useRouter();
    const { id } = useParams();
    const { isAdmin } = useAuth();
    const [model, setModel] = useState<AiModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
            return;
        }

        const fetchModel = async () => {
            try {
                setLoading(true);
                const modelData = await modelService.getModelById(Number(id));
                setModel(modelData);
            } catch (err) {
                console.error('Error fetching model:', err);
                setError('Error al cargar el modelo');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchModel();
        }
    }, [id, isAdmin, router]);

    const handleSubmit = async (modelData: Partial<AiModel>) => {
        await modelService.updateModel(Number(id), modelData);
    };

    if (!isAdmin) {
        return null;
    }

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
                    Editar Modelo: {model.name}
                </h1>
                <div className="card p-6">
                    <ModelForm 
                        model={model} 
                        onSubmit={handleSubmit} 
                        isEditing={true} 
                    />
                </div>
            </div>
        </MainLayout>
    );
} 