import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { Card } from '@/components/common';
import { AiModel } from '@/types/models';
import { LineChart, BarChart } from '@/components/charts';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend
);

interface Props {
    models: AiModel[];
    className?: string;
}

export const ModelCharts = ({ models, className = '' }: Props) => {
    // Preparar datos para los gráficos
    const topModels = models
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    const categoryData = models.reduce((acc, model) => {
        const category = model.category.category_name;
        if (!acc[category]) {
            acc[category] = { count: 0, totalScore: 0 };
        }
        acc[category].count += 1;
        acc[category].totalScore += model.score;
        return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    const monthlyTrends = models.reduce((acc, model) => {
        const month = new Date(model.release_date).toLocaleString('es', { month: 'short' });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(model.score);
        return acc;
    }, {} as Record<string, number[]>);

    // Configuración de los gráficos
    const barChartData = {
        labels: topModels.map(model => model.name),
        datasets: [{
            label: 'Puntuación',
            data: topModels.map(model => model.score),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
        }]
    };

    const doughnutData = {
        labels: Object.keys(categoryData),
        datasets: [{
            data: Object.values(categoryData).map(d => d.count),
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(147, 51, 234, 0.8)',
                'rgba(236, 72, 153, 0.8)',
                'rgba(248, 113, 113, 0.8)'
            ]
        }]
    };

    const lineChartData = {
        labels: Object.keys(monthlyTrends),
        datasets: [{
            label: 'Promedio mensual',
            data: Object.values(monthlyTrends).map(scores => 
                scores.reduce((a, b) => a + b, 0) / scores.length
            ),
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const radarData = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: 'Promedio por categoría',
            data: Object.values(categoryData).map(d => d.totalScore / d.count),
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(99, 102, 241)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(99, 102, 241)'
        }]
    };

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
            <Card className="p-6">
                <h3 className="text-xl font-got mb-4">Top 10 Modelos</h3>
                <div className="h-80">
                    <Bar 
                        data={barChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }}
                    />
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-xl font-got mb-4">Distribución por Categoría</h3>
                <div className="h-80">
                    <Doughnut 
                        data={doughnutData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false
                        }}
                    />
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-xl font-got mb-4">Tendencia Mensual</h3>
                <div className="h-80">
                    <Line 
                        data={lineChartData}
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

            <Card className="p-6">
                <h3 className="text-xl font-got mb-4">Rendimiento por Categoría</h3>
                <div className="h-80">
                    <Radar 
                        data={radarData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                r: {
                                    beginAtZero: true,
                                    max: 10
                                }
                            }
                        }}
                    />
                </div>
            </Card>
        </div>
    );
};

export const ModelChartsOld = ({ models }: Props) => {
    return (
        <div className="space-y-6">
            <div className="bg-got-dark-card p-6 rounded-lg">
                <h3 className="text-xl font-got mb-4">Tendencias de Rendimiento</h3>
                <LineChart data={models} />
            </div>
            <div className="bg-got-dark-card p-6 rounded-lg">
                <h3 className="text-xl font-got mb-4">Comparación de Métricas</h3>
                <BarChart data={models} />
            </div>
        </div>
    );
}; 