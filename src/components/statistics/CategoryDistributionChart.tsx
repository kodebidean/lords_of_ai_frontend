import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';

interface CategoryData {
    name: string;
    value: number;
}

interface CategoryDistributionChartProps {
    data: CategoryData[];
}

const COLORS = ['#C41E3A', '#1E3A8A', '#FFD700', '#00FF9C', '#9333EA', '#EC4899'];

export const CategoryDistributionChart = ({ data }: CategoryDistributionChartProps) => {
    return (
        <div className="card p-6">
            <h3 className="text-xl font-got mb-6 bg-gradient-tech text-transparent bg-clip-text">
                Distribución por Categoría
            </h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1E293B',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                fontFamily: 'Space Grotesk'
                            }}
                        />
                        <Legend 
                            formatter={(value) => <span className="font-tech text-got-light-text dark:text-got-dark-text">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}; 