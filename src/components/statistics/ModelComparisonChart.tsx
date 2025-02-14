import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ModelData {
    name: string;
    votes: number;
}

interface ModelComparisonChartProps {
    data: ModelData[];
}

export const ModelComparisonChart = ({ data }: ModelComparisonChartProps) => {
    return (
        <div className="card p-6">
            <h3 className="text-xl font-got mb-6 bg-gradient-tech text-transparent bg-clip-text">
                Comparación de Votos
            </h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            dataKey="name" 
                            stroke="#E2E8F0"
                            style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
                        />
                        <YAxis 
                            stroke="#E2E8F0"
                            style={{ fontSize: '12px', fontFamily: 'Space Grotesk' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1E293B',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                fontFamily: 'Space Grotesk'
                            }}
                        />
                        <Bar 
                            dataKey="votes" 
                            fill="#00FF9C"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}; 