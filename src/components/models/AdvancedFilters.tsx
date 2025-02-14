import { useState } from 'react';
import { Card, Input, Button } from '@/components/common';
import { FilterOptions } from '@/types/models';

interface Props {
    onFilter: (filters: FilterOptions) => void;
    onReset: () => void;
}

export const AdvancedFilters = ({ onFilter, onReset }: Props) => {
    const [filters, setFilters] = useState<FilterOptions>({
        category: 'all',
        timeRange: 'month',
        minScore: 0,
        maxScore: 10,
        developer: '',
        releaseDate: '',
        sortBy: 'score',
        sortOrder: 'desc'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        setFilters({
            category: 'all',
            timeRange: 'month',
            minScore: 0,
            maxScore: 10,
            developer: '',
            releaseDate: '',
            sortBy: 'score',
            sortOrder: 'desc'
        });
        onReset();
    };

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Categoría
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                        >
                            <option value="all">Todas las categorías</option>
                            <option value="text">Texto</option>
                            <option value="image">Imagen</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Período
                        </label>
                        <select
                            value={filters.timeRange}
                            onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as FilterOptions['timeRange'] })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                        >
                            <option value="week">Última semana</option>
                            <option value="month">Último mes</option>
                            <option value="year">Último año</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Puntuación mínima
                        </label>
                        <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={filters.minScore}
                            onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Puntuación máxima
                        </label>
                        <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={filters.maxScore}
                            onChange={(e) => setFilters({ ...filters, maxScore: Number(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Desarrollador
                        </label>
                        <Input
                            type="text"
                            value={filters.developer}
                            onChange={(e) => setFilters({ ...filters, developer: e.target.value })}
                            placeholder="Nombre del desarrollador"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Fecha de lanzamiento
                        </label>
                        <Input
                            type="date"
                            value={filters.releaseDate}
                            onChange={(e) => setFilters({ ...filters, releaseDate: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Ordenar por
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                        >
                            <option value="score">Puntuación</option>
                            <option value="name">Nombre</option>
                            <option value="release_date">Fecha de lanzamiento</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-got-dark-text mb-2">
                            Orden
                        </label>
                        <select
                            value={filters.sortOrder}
                            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as FilterOptions['sortOrder'] })}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-got-tech focus:ring-got-tech"
                        >
                            <option value="desc">Descendente</option>
                            <option value="asc">Ascendente</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                    >
                        Restablecer
                    </Button>
                    <Button type="submit">
                        Aplicar filtros
                    </Button>
                </div>
            </form>
        </Card>
    );
}; 