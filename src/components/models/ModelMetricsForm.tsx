import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { ModelCharacteristic } from '@/types/models';

interface ModelMetricsFormProps {
    onSubmit: (metricData: Omit<ModelCharacteristic, 'characteristic_id' | 'model_id' | 'created_at'>) => Promise<void>;
}

const VALID_CHARACTERISTICS = [
    'precision',
    'exactitud',
    'sensibilidad',
    'puntuacion_f1',
    'perdida',
    'tiempo_inferencia',
    'uso_memoria',
    'tasa_aprendizaje',
    'generalizacion',
    'robustez',
    'eficiencia_computacional',
    'convergencia'
] as const;

export const ModelMetricsForm = ({ onSubmit }: ModelMetricsFormProps) => {
    const [formData, setFormData] = useState({
        characteristic_name: '',
        value: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit({
                characteristic_name: formData.characteristic_name,
                value: Number(formData.value)
            });
            setFormData({ characteristic_name: '', value: '' });
        } catch (err) {
            console.error('Error submitting metric:', err);
            setError('Error al guardar la métrica');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="text-got-primary bg-got-primary/10 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="characteristic_name" className="block text-sm font-medium mb-1">
                    Característica
                </label>
                <select
                    id="characteristic_name"
                    name="characteristic_name"
                    value={formData.characteristic_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, characteristic_name: e.target.value }))}
                    required
                    className="w-full p-2 rounded-lg bg-got-light-bg dark:bg-got-dark-bg border border-got-light-border dark:border-got-dark-border"
                >
                    <option value="">Seleccionar característica</option>
                    {VALID_CHARACTERISTICS.map(char => (
                        <option key={char} value={char}>
                            {char.replace('_', ' ').charAt(0).toUpperCase() + char.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="value" className="block text-sm font-medium mb-1">
                    Valor (0-100)
                </label>
                <input
                    type="number"
                    id="value"
                    name="value"
                    min="0"
                    max="100"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    required
                    className="w-full p-2 rounded-lg bg-got-light-bg dark:bg-got-dark-bg border border-got-light-border dark:border-got-dark-border"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Guardando...' : 'Añadir Métrica'}
            </Button>
        </form>
    );
}; 