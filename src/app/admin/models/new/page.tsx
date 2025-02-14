'use client';

import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelForm } from '@/components/models/ModelForm';
import { modelService } from '@/services/models';
import { useAuth } from '@/hooks/useAuth';
import { AiModel } from '@/types/models';

export default function NewModelPage() {
    const router = useRouter();
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        router.push('/');
        return null;
    }

    const handleSubmit = async (modelData: Partial<AiModel>) => {
        await modelService.createModel(modelData);
    };

    return (
        <MainLayout>
            <div className="py-6">
                <h1 className="text-3xl font-got bg-gradient-tech text-transparent bg-clip-text mb-6">
                    Crear Nuevo Modelo
                </h1>
                <div className="card p-6">
                    <ModelForm onSubmit={handleSubmit} />
                </div>
            </div>
        </MainLayout>
    );
} 