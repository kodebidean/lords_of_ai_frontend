'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { modelService } from '@/services/models';
import { AiModel } from '@/types/models';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function StatisticsPage() {
    const [models, setModels] = useState<AiModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await modelService.getModels();
                setModels(response.data);
            } catch (err) {
                console.error('Error fetching models:', err);
                setError('Error al cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const categoryStats = models.reduce((acc, model) => {
        acc[model.category_name] = (acc[model.category_name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryStats).map(([name, value]) => ({
        name,
        value
    }));

    const modelsByLikes = [...models]
        .sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes))
        .slice(0, 10);

    const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'];

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[600px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-got-tech"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="py-6">
                <h1 className="text-3xl font-got bg-gradient-tech text-transparent bg-clip-text mb-6">
                    Estadísticas Generales
                </h1>

                {error && (
                    <div className="text-got-primary bg-got-primary/10 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <h2 className="text-xl font-got mb-4">Modelos por Categoría</h2>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        label={({ name, percent }) => 
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={COLORS[index % COLORS.length]} 
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h2 className="text-xl font-got mb-4">Top 10 Modelos por Valoración</h2>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={modelsByLikes}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis 
                                        type="category" 
                                        dataKey="name" 
                                        width={150}
                                    />
                                    <Tooltip />
                                    <Bar 
                                        dataKey="likes" 
                                        fill="#10B981" 
                                        name="Me gusta"
                                    />
                                    <Bar 
                                        dataKey="dislikes" 
                                        fill="#EF4444" 
                                        name="No me gusta"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="lg:col-span-2 card p-6">
                        <h2 className="text-xl font-got mb-4">Resumen General</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-got-tech">
                                    {models.length}
                                </p>
                                <p className="text-got-light-text dark:text-got-dark-text">
                                    Modelos Totales
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-got-tech">
                                    {Object.keys(categoryStats).length}
                                </p>
                                <p className="text-got-light-text dark:text-got-dark-text">
                                    Categorías
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-got-tech">
                                    {models.reduce((acc, model) => acc + model.likes, 0)}
                                </p>
                                <p className="text-got-light-text dark:text-got-dark-text">
                                    Me gusta Totales
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 