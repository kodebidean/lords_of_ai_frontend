import React, { useState } from 'react';
import { 
    Chart, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Button } from '../common/Button';
import { AddCharacteristicModal } from './AddCharacteristicModal';


Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

interface Characteristic {
    id: number;
    name: string;
    value: number;
    category: string;
    confidence_level: number;
    measurement_date: string;
}

interface Props {
    characteristics: Characteristic[];
    onCharacteristicAdd: () => void;
    className?: string;
}

export const CharacteristicsPanel: React.FC<Props> = ({
    characteristics,
    onCharacteristicAdd,
    className = ''
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [...new Set(characteristics.map(c => c.category))];
    
    const filteredCharacteristics = selectedCategory === 'all'
        ? characteristics
        : characteristics.filter(c => c.category === selectedCategory);

    const chartData = {
        labels: filteredCharacteristics.map(c => c.name),
        datasets: [{
            label: 'Valor',
            data: filteredCharacteristics.map(c => c.value),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    return (
        <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Características</h2>
                <Button 
                    onClick={() => setShowAddModal(true)}
                    variant="primary"
                >
                    Agregar Característica
                </Button>
            </div>

            <div className="mb-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select w-full sm:w-auto"
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {filteredCharacteristics.map(characteristic => (
                    <div 
                        key={characteristic.id}
                        className="p-4 border rounded-lg"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium">{characteristic.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {characteristic.category}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-semibold">
                                    {characteristic.value}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Confianza: {(characteristic.confidence_level * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-64">
                <Line 
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false
                    }}
                />
            </div>

            <AddCharacteristicModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={onCharacteristicAdd}
            />
        </div>
    );
}; 