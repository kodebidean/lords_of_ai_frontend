import { ModelMetric } from '@/types/models';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

interface ModelMetricsChartProps {
    metrics: ModelMetric[];
}

export const ModelMetricsChart = ({ metrics }: ModelMetricsChartProps) => {
    const formattedData = metrics.map(metric => ({
        characteristic: metric.characteristic_name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        value: metric.value
    }));

    return (
        <div className="w-full h-[400px] card p-6">
            <h2 className="text-xl font-got mb-4">Gráfico de Métricas</h2>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={formattedData}>
                    <PolarGrid />
                    <PolarAngleAxis
                        dataKey="characteristic"
                        tick={{ fill: 'currentColor', fontSize: 12 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                        name="Valor"
                        dataKey="value"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                    />
                    <Tooltip />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}; 