import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { AiModel } from '@/types/models';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Props {
    data: AiModel[];
}

export const LineChart = ({ data }: Props) => {
    const chartData = {
        labels: data.map(model => model.name),
        datasets: [{
            label: 'Puntuación',
            data: data.map(model => model.score),
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    return <Line data={chartData} />;
}; 