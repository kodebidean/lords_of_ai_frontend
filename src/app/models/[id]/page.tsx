'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModelStatistics } from '@/components/models/ModelStatistics';
import { ModelRankingCard } from '@/components/models/ModelRankingCard';
import { Button } from '@/components/common/Button';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';
import { ArrowUpIcon, ArrowDownIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ModelDetailPage() {
    const { id } = useParams();
    const [model, setModel] = useState<AiModel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isVoting, setIsVoting] = useState(false);

    const fetchModel = useCallback(async () => {
        try {
            setLoading(true);
            const data = await modelService.getModelById(Number(id));
            setModel(data);
        } catch (err) {
            setError('Error al cargar el modelo');
            console.error('Error fetching model:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchModel();
        }
    }, [id, fetchModel]);

    const handleVote = async (value: 1 | -1) => {
        if (!model) return;
        
        try {
            setIsVoting(true);
            await modelService.voteModel(model.model_id, value);
            await fetchModel();
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            </MainLayout>
        );
    }

    if (error || !model) {
        return (
            <MainLayout>
                <div className="text-center py-10 text-red-500">
                    {error || 'Modelo no encontrado'}
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-8 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {model.name}
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Desarrollado por {model.developer}
                                    </p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    {model.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Info principal */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                                        <p className="text-gray-600">{model.description}</p>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                                Lanzado el {new Date(model.release_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                                {model.total_votes || 0} votos
                                            </span>
                                        </div>
                                    </div>

                                    {model.statistics && <ModelStatistics statistics={model.statistics} />}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Votación */}
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold mb-4">Valoración</h3>
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="text-4xl font-bold text-indigo-600">
                                                {model.vote_score || 0}
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => handleVote(1)}
                                                    disabled={isVoting}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <ArrowUpIcon className="h-5 w-5 text-green-500" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleVote(-1)}
                                                    disabled={isVoting}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <ArrowDownIcon className="h-5 w-5 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ranking */}
                                    {model.rank && (
                                        <ModelRankingCard
                                            ranking={{
                                                ranking_id: 0, // Temporal
                                                category: model.category,
                                                rank: model.rank,
                                                score: model.score || 0,
                                                updated_at: new Date().toISOString()
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 