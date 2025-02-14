import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ScoreData {
    date: string;
    score: number;
}

interface ScoreEvolutionChartProps {
    data: ScoreData[];
}

export const ScoreEvolutionChart = ({ data }: ScoreEvolutionChartProps) => {
    return (
        <div className="card p-6">
            <h3 className="text-xl font-got mb-6 bg-gradient-tech text-transparent bg-clip-text">
                Evolución de Puntuaciones
            </h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                            dataKey="date" 
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
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#00FF9C"
                            strokeWidth={2}
                            dot={{ fill: '#00FF9C', strokeWidth: 2 }}
                            activeDot={{ r: 8, fill: '#00FF9C', stroke: '#1E293B' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}; 