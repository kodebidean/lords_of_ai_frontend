import { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { AiModel } from '@/types/models';
import { modelService } from '@/services/models';
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
    currentModel: AiModel;
    className?: string;
}

export const ModelComparison = ({ currentModel, className = '' }: Props) => {
    const [compareModel, setCompareModel] = useState<AiModel | null>(null);
    const [availableModels, setAvailableModels] = useState<AiModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const models = await modelService.getModelsByCategory(currentModel.category_id);
                setAvailableModels(models.filter(m => m.model_id !== currentModel.model_id));
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        };
        fetchModels();
    }, [currentModel.category_id, currentModel.model_id]);

    const handleCompare = async (modelId: number) => {
        setIsLoading(true);
        try {
            const model = await modelService.getModelById(modelId);
            setCompareModel(model);
        } catch (error) {
            console.error('Error fetching comparison model:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getComparisonData = () => {
        const characteristics = currentModel.characteristics.map(c => ({
            name: c.characteristic_name,
            current: c.value,
            compare: compareModel?.characteristics.find(
                cc => cc.characteristic_name === c.characteristic_name
            )?.value || 0
        }));

        return {
            labels: characteristics.map(c => c.name),
            datasets: [
                {
                    label: currentModel.name,
                    data: characteristics.map(c => c.current),
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderWidth: 2
                },
                {
                    label: compareModel?.name || 'No seleccionado',
                    data: characteristics.map(c => c.compare),
                    backgroundColor: 'rgba(244, 63, 94, 0.2)',
                    borderColor: 'rgb(244, 63, 94)',
                    borderWidth: 2
                }
            ]
        };
    };

    return (
        <Card className={className}>
            <h3 className="text-xl font-got mb-6">Comparar Modelos</h3>
            
            <div className="mb-6">
                <select
                    onChange={(e) => handleCompare(Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                    disabled={isLoading}
                >
                    <option value="">Seleccionar modelo para comparar</option>
                    {availableModels.map(model => (
                        <option key={model.model_id} value={model.model_id}>
                            {model.name}
                        </option>
                    ))}
                </select>
            </div>

            {compareModel && (
                <>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-got-light-bg/50 dark:bg-got-dark-bg/50">
                            <h4 className="font-medium mb-2">{currentModel.name}</h4>
                            <p className="text-sm text-got-light-text dark:text-got-dark-text">
                                Developer: {currentModel.developer}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-got-light-bg/50 dark:bg-got-dark-bg/50">
                            <h4 className="font-medium mb-2">{compareModel.name}</h4>
                            <p className="text-sm text-got-light-text dark:text-got-dark-text">
                                Developer: {compareModel.developer}
                            </p>
                        </div>
                    </div>

                    <div className="h-96">
                        <Radar 
                            data={getComparisonData()}
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
                </>
            )}
        </Card>
    );
}; 