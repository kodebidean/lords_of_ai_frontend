import { Bar } from 'react-chartjs-2';
import { AiModel } from '@/types/models';

export const BarChart = ({ data }: { data: AiModel[] }) => {
    const chartData = {
        labels: data.map(model => model.name),
        datasets: [{
            label: 'Puntuación',
            data: data.map(model => model.score),
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 1
        }]
    };

    return <Bar data={chartData} />;
}; 