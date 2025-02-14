import { AiModel } from '@/types/models';
import { BarChart } from '@/components/charts';

interface Props {
    model: AiModel;
}

export const BenchmarkComparison = ({ model }: Props) => {
    return (
        <div className="bg-got-dark-card p-6 rounded-lg">
            <h3 className="text-xl font-got mb-4">Comparación de Rendimiento</h3>
            <div className="h-64">
                <BarChart data={[model]} />
            </div>
        </div>
    );
}; 