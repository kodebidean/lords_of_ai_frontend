import { useState } from 'react';
import { Card } from '../common';
import { BenchmarkResult } from '@/types/models';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatDate } from '@/utils/date';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    benchmarks: BenchmarkResult[];
    className?: string;
}

export const ModelBenchmarks = ({ benchmarks, className = '' }: Props) => {
    const [selectedMetric, setSelectedMetric] = useState<'score' | 'execution_time' | 'memory_usage'>('score');

    const sortedBenchmarks = [...benchmarks].sort((a, b) => 
        new Date(b.test_date).getTime() - new Date(a.test_date).getTime()
    );

    const chartData = {
        labels: sortedBenchmarks.map(b => b.benchmark_name),
        datasets: [{
            label: selectedMetric === 'score' ? 'Puntuación' :
                   selectedMetric === 'execution_time' ? 'Tiempo de Ejecución (ms)' :
                   'Uso de Memoria (MB)',
            data: sortedBenchmarks.map(b => b[selectedMetric] || 0),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
        }]
    };

    return (
        <Card className={className}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-got">Resultados de Benchmark</h3>
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as 'score' | 'execution_time' | 'memory_usage')}
                    className="rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                >
                    <option value="score">Puntuación</option>
                    <option value="execution_time">Tiempo de Ejecución</option>
                    <option value="memory_usage">Uso de Memoria</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {sortedBenchmarks.map((benchmark) => (
                    <div 
                        key={`${benchmark.benchmark_id}-${benchmark.test_date}`}
                        className="p-4 rounded-lg bg-got-light-bg/50 dark:bg-got-dark-bg/50"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium">
                                    {benchmark.benchmark_name}
                                </h4>
                                <p className="text-sm text-got-light-text dark:text-got-dark-text">
                                    {formatDate(benchmark.test_date)}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-semibold">
                                    {benchmark.score.toFixed(2)}
                                </div>
                                {benchmark.execution_time && (
                                    <div className="text-sm text-got-light-text dark:text-got-dark-text">
                                        {benchmark.execution_time}ms
                                    </div>
                                )}
                                {benchmark.memory_usage && (
                                    <div className="text-sm text-got-light-text dark:text-got-dark-text">
                                        {benchmark.memory_usage}MB
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-64">
                <Bar 
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
            </div>
        </Card>
    );
}; 