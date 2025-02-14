import { ModelStatistic } from '@/types/models';

interface ModelStatisticsProps {
    statistics: ModelStatistic[];
}

export const ModelStatistics = ({ statistics }: ModelStatisticsProps) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <div className="space-y-4">
                {statistics?.map((stat) => (
                    <div key={stat.stat_id} className="flex items-center justify-between">
                        <span className="text-gray-600 capitalize">{stat.metric}</span>
                        <div className="flex items-center">
                            <div className="w-48 h-2 bg-gray-200 rounded-full mr-2">
                                <div
                                    className="h-full bg-indigo-600 rounded-full"
                                    style={{ width: `${stat.value}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium">{stat.value}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 