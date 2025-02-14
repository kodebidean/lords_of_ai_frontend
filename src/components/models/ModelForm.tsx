import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { AiModel, Category } from '@/types/models';


interface ModelFormProps {
    model?: AiModel;
    onSubmit: (modelData: Partial<AiModel>) => Promise<void>;
    isEditing?: boolean;
}

export const ModelForm = ({ model, onSubmit, isEditing = false }: ModelFormProps) => {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: model?.name || '',
        developer: model?.developer || '',
        category_id: model?.category_id || '',
        description: model?.description || '',
        release_date: model?.release_date || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Error al cargar las categorías');
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit({
                ...formData,
                category_id: Number(formData.category_id)
            });
            router.push('/models');
        } catch (err) {
            console.error('Error submitting form:', err);
            setError('Error al guardar el modelo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="text-got-primary bg-got-primary/10 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Nombre del Modelo
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded-lg bg-got-light-bg dark:bg-got-dark-bg border border-got-light-border dark:border-got-dark-border"
                    />
                </div>

                <div>
                    <label htmlFor="developer" className="block text-sm font-medium mb-1">
                        Desarrollador
                    </label>
                    <input
                        type="text"
                        id="developer"
                        name="developer"
                        value={formData.developer}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded-lg bg-got-light-bg dark:bg-got-dark-bg border border-got-light-border dark:border-got-dark-border"
                    />
                </div>

                <div>
                    <label htmlFor="category_id" className="block text-sm font-medium mb-1">
                        Categoría
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded-lg bg-got-light-bg dark:bg-got-dark-bg border border-got-light-border dark:border-got-dark-border"
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(category => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full p-2 rounded-lg bg-got-light-bg dark:bg-got-dark-bg border border-got-light-border dark:border-got-dark-border"
                    />
                </div>

                <div>
                    <label htmlFor="release_date" className="block text-sm font-medium mb-1">
                        Fecha de Lanzamiento
                    </label>
                    <input
                        type="date"
                        id="release_date"
                        name="release_date"
                        value={formData.release_date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 rounded-lg bg-got-light-bg dark:bg-got-dark-bg border border-got-light-border dark:border-got-dark-border"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                </Button>
            </div>
        </form>
    );
}; 