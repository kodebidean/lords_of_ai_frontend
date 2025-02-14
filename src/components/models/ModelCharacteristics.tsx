import { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AiModel } from '@/types/models';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface Props {
    model: AiModel;
    onAddCharacteristic?: () => void;
    className?: string;
}

export const ModelCharacteristics = ({ 
    model,
    onAddCharacteristic,
    className = ''
}: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const characteristics = model.characteristics || [];
    const categories = [...new Set(characteristics.map(c => c.category?.category_name || 'Sin categoría'))];
    
    const filteredCharacteristics = selectedCategory === 'all'
        ? characteristics
        : characteristics.filter(c => c.category?.category_name === selectedCategory);

    const chartData = {
        labels: filteredCharacteristics.map(c => c.characteristic_name),
        datasets: [{
            label: 'Valor',
            data: filteredCharacteristics.map(c => c.value),
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
        <Card className={className}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-got">Características</h3>
                {onAddCharacteristic && (
                    <Button onClick={onAddCharacteristic} size="sm">
                        Agregar
                    </Button>
                )}
            </div>

            <div className="mb-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                {filteredCharacteristics.map(characteristic => (
                    <div 
                        key={characteristic.characteristic_id}
                        className="p-4 bg-got-dark-bg rounded-md"
                    >
                        <h4 className="font-got text-lg mb-2">
                            {characteristic.characteristic_name}
                        </h4>
                        <div className="flex justify-between items-center">
                            <span className="text-got-dark-text">
                                Valor: {characteristic.value}
                            </span>
                            <span className="text-got-dark-text">
                                Confianza: {characteristic.confidence_level}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-64">
                <Radar 
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }}
                />
            </div>
        </Card>
    );
}; 