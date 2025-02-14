'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';
import { MainLayout } from '@/components/layout/MainLayout';

export default function HomePage() {
    const [featuredModels, setFeaturedModels] = useState<AiModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedModels = async () => {
            try {
                const data = await modelService.getFeaturedModels();
                setFeaturedModels(data || []);
            } catch (error) {
                console.error('Error fetching featured models:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedModels();
    }, []);

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <h1 className="text-4xl font-got mb-4 bg-gradient-tech text-transparent bg-clip-text">
                        Lords of the AI
                    </h1>
                    <p className="text-xl text-got-dark-text">
                        Explora y compara los mejores modelos de IA
                    </p>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-got mb-6">
                        Modelos Destacados
                    </h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredModels.map(model => (
                                <Link 
                                    key={model.model_id} 
                                    href={`/models/${model.model_id}`}
                                    className="bg-got-dark-card p-6 rounded-lg hover:bg-got-dark-bg transition-colors"
                                >
                                    <h3 className="text-xl font-got mb-2">{model.name}</h3>
                                    <p className="text-got-dark-text mb-4">{model.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-got-tech font-bold">
                                            Score: {model.score}
                                        </span>
                                        <span className="bg-got-tech/10 text-got-tech px-3 py-1 rounded-full text-sm">
                                            {model.category?.category_name || 'General'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-got-dark-card p-6 rounded-lg">
                            <h2 className="text-2xl font-got mb-4">Rankings</h2>
                            <p className="text-got-dark-text mb-4">
                                Descubre los modelos mejor valorados en cada categoría
                            </p>
                            <Link 
                                href="/rankings"
                                className="inline-block bg-got-tech text-white px-6 py-2 rounded-lg hover:bg-got-tech/90 transition-colors"
                            >
                                Ver Rankings
                            </Link>
                        </div>

                        <div className="bg-got-dark-card p-6 rounded-lg">
                            <h2 className="text-2xl font-got mb-4">Comparación Avanzada</h2>
                            <p className="text-got-dark-text mb-4">
                                Analiza en detalle las características de cada modelo
                            </p>
                            <Link 
                                href="/advanced"
                                className="inline-block bg-got-tech text-white px-6 py-2 rounded-lg hover:bg-got-tech/90 transition-colors"
                            >
                                Comparar Modelos
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
