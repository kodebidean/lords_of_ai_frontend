import { useState } from 'react';
import { Input, Button } from '../common';

interface Props {
  onSearch: (filters: {
    query: string;
    category?: string;
    minScore?: number;
    maxDate?: string;
  }) => void;
}

export const ModelSearch = ({ onSearch }: Props) => {
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    minScore: 0,
    maxDate: ''
  });

  return (
    <div className="card p-6">
      <h3 className="text-xl font-got mb-4">Búsqueda Avanzada</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Buscar modelos..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="input-got"
        >
          <option value="">Todas las categorías</option>
          <option value="text">Texto</option>
          <option value="image">Imagen</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
        <Input
          type="number"
          placeholder="Puntuación mínima"
          value={filters.minScore}
          onChange={(e) => setFilters({ ...filters, minScore: Number(e.target.value) })}
        />
        <Input
          type="date"
          value={filters.maxDate}
          onChange={(e) => setFilters({ ...filters, maxDate: e.target.value })}
        />
      </div>
      <Button 
        className="mt-4"
        onClick={() => onSearch(filters)}
      >
        Buscar
      </Button>
    </div>
  );
}; 