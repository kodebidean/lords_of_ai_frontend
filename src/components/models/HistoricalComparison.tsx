import { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Card } from '@/components/common';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';
import { LineChart } from '@/components/charts';

interface Props {
    models: AiModel[];
    className?: string;
}

interface HistoricalData {
    date: string;
    score: number;
    benchmarks: {
        name: string;
        value: number;
    }[];
}

interface ModelHistory {
    modelId: number;
    name: string;
    data: HistoricalData[];
}

export const HistoricalComparison = ({ models, className = '' }: Props) => {
    const [historicalData, setHistoricalData] = useState<ModelHistory[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<'score' | 'accuracy' | 'speed' | 'efficiency'>('score');
    const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistoricalData = useCallback(async () => {
        setIsLoading(true);
        try {
            const promises = models.map(model => 
                modelService.getModelHistory(model.model_id, timeRange)
            );
            const results = await Promise.all(promises);
            
            setHistoricalData(results.map((data, index) => ({
                modelId: models[index].model_id,
                name: models[index].name,
                data: data
            })));
        } catch (error) {
            console.error('Error fetching historical data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [models, timeRange]);

    useEffect(() => {
        fetchHistoricalData();
    }, [fetchHistoricalData]);

    const chartData = {
        labels: historicalData[0]?.data.map(d => 
            new Date(d.date).toLocaleDateString('es', { 
                month: 'short', 
                day: 'numeric' 
            })
        ) || [],
        datasets: historicalData.map((model, index) => ({
            label: model.name,
            data: model.data.map(d => 
                selectedMetric === 'score' 
                    ? d.score 
                    : d.benchmarks.find(b => b.name === selectedMetric)?.value || 0
            ),
            borderColor: [
                'rgb(99, 102, 241)',
                'rgb(59, 130, 246)',
                'rgb(147, 51, 234)',
                'rgb(236, 72, 153)'
            ][index],
            backgroundColor: [
                'rgba(99, 102, 241, 0.1)',
                'rgba(59, 130, 246, 0.1)',
                'rgba(147, 51, 234, 0.1)',
                'rgba(236, 72, 153, 0.1)'
            ][index],
            fill: true,
            tension: 0.4
        }))
    };

    const metrics = [
        { value: 'score', label: 'Puntuación General' },
        { value: 'accuracy', label: 'Precisión' },
        { value: 'speed', label: 'Velocidad' },
        { value: 'efficiency', label: 'Eficiencia' }
    ];

    const timeRanges = [
        { value: '1m', label: '1 Mes' },
        { value: '3m', label: '3 Meses' },
        { value: '6m', label: '6 Meses' },
        { value: '1y', label: '1 Año' }
    ];

    return (
        <Card className={`p-6 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-got">Comparativa Histórica</h3>
                <div className="flex gap-4">
                    <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value as typeof selectedMetric)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                    >
                        {metrics.map(metric => (
                            <option key={metric.value} value={metric.value}>
                                {metric.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                    >
                        {timeRanges.map(range => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="h-80 flex items-center justify-center">
                    <p className="text-got-dark-text">Cargando datos históricos...</p>
                </div>
            ) : (
                <div className="h-80">
                    <Line 
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: selectedMetric === 'score' ? 10 : 100
                                }
                            },
                            plugins: {
                                legend: {
                                    position: 'bottom'
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                }
                            },
                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            }
                        }}
                    />
                </div>
            )}

            <div className="mt-6">
                <h4 className="text-lg font-got mb-3">Resumen de Cambios</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {historicalData.map(model => {
                        const firstValue = selectedMetric === 'score' 
                            ? model.data[0]?.score 
                            : model.data[0]?.benchmarks.find(b => b.name === selectedMetric)?.value || 0;
                        const lastValue = selectedMetric === 'score'
                            ? model.data[model.data.length - 1]?.score
                            : model.data[model.data.length - 1]?.benchmarks.find(b => b.name === selectedMetric)?.value || 0;
                        const change = ((lastValue - firstValue) / firstValue * 100).toFixed(1);
                        
                        return (
                            <div 
                                key={model.modelId}
                                className="p-4 rounded-lg bg-got-light-bg/5"
                            >
                                <h5 className="font-medium mb-2">{model.name}</h5>
                                <div className="flex justify-between items-center">
                                    <span className="text-got-dark-text">
                                        {lastValue.toFixed(2)}
                                    </span>
                                    <span className={`${
                                        Number(change) > 0 
                                            ? 'text-green-500' 
                                            : 'text-red-500'
                                    }`}>
                                        {change}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

export const HistoricalComparisonLineChart = ({ models }: { models: AiModel[] }) => {
    return (
        <div className="bg-got-dark-card p-6 rounded-lg">
            <h3 className="text-xl font-got mb-4">Comparación Histórica</h3>
            <LineChart data={models} />
        </div>
    );
}; 