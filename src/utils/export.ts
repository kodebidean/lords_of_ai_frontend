import { AiModel } from '@/types/models';

interface ExportableData {
    [key: string]: string | number | boolean | Date;
}

export const exportToCSV = <T extends ExportableData>(data: T[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const cell = row[header];
                return typeof cell === 'string' ? `"${cell}"` : cell;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const prepareModelDataForExport = (models: AiModel[]) => {
    return models.map(model => ({
        ID: model.model_id,
        Nombre: model.name,
        Desarrollador: model.developer,
        Categoría: model.category.category_name,
        Puntuación: model.score,
        'Fecha de Lanzamiento': model.release_date,
        Descripción: model.description
    }));
};

export const exportToJSON = <T extends ExportableData>(data: T[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToExcel = async <T extends ExportableData>(data: T[], filename: string) => {
    const XLSX = await import('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rankings');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}; 