import { AiModel } from '@/types/models';

interface Props {
    model: AiModel;
}

export const PerformanceMetrics = ({ model }: Props) => {
    return (
        <div className="bg-got-dark-card p-6 rounded-lg">
            <h3 className="text-xl font-got mb-4">Métricas de Rendimiento</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-got-dark-text">Puntuación</p>
                    <p className="text-2xl font-bold">{model.score.toFixed(1)}</p>
                </div>
                <div>
                    <p className="text-got-dark-text">Categoría</p>
                    <p className="text-2xl font-bold">{model.category.category_name}</p>
                </div>
            </div>
        </div>
    );
}; 