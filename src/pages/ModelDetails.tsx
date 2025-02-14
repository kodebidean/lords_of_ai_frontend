import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
    ModelHeader, 
    CharacteristicsPanel, 
    BenchmarkResults, 
    VersionHistory,
    ComparisonWidget,
    ModelStats 
} from '../components/model';
import { useModelData } from '../hooks/useModelData';
import { LoadingSpinner, ErrorAlert } from '../components/common';

const ModelDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { model, loading, error, refetch } = useModelData(id);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;
    if (!model) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ModelHeader 
                model={model} 
                onUpdate={refetch}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2">
                    <CharacteristicsPanel 
                        characteristics={model.characteristics}
                        onCharacteristicAdd={refetch}
                    />
                    
                    <BenchmarkResults 
                        benchmarks={model.benchmark_results}
                        className="mt-6"
                    />
                </div>
                
                <div className="space-y-6">
                    <ModelStats 
                        stats={model.stats}
                        className="bg-white shadow rounded-lg p-6"
                    />
                    
                    <ComparisonWidget 
                        currentModelId={model.model_id}
                        className="bg-white shadow rounded-lg p-6"
                    />
                    
                    <VersionHistory 
                        versions={model.versions}
                        className="bg-white shadow rounded-lg p-6"
                    />
                </div>
            </div>
        </div>
    );
};

export default ModelDetails; 