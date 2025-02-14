import { Card, Timeline } from '../common';
import { ModelVersion } from '@/types/models';
import { formatDate } from '@/utils/date';


interface Props {
    versions: ModelVersion[];
    className?: string;
}

export const ModelVersionHistory = ({ versions, className = '' }: Props) => {
    const sortedVersions = [...versions].sort((a, b) => 
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );

    return (
        <Card className={className}>
            <h3 className="text-xl font-got mb-6">Historial de Versiones</h3>
            
            <Timeline>
                {sortedVersions.map((version) => (
                    <Timeline.Item
                        key={version.version_id}
                        date={formatDate(version.release_date)}
                        title={`Versión ${version.version_number}`}
                        isMajor={version.is_major_update}
                    >
                        <div className="space-y-2">
                            <p className="text-sm text-got-light-text dark:text-got-dark-text">
                                {version.changes_description}
                            </p>
                            {version.performance_impact && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-medium">
                                        Impacto en Rendimiento:
                                    </span>
                                    <span className={`text-xs font-semibold ${
                                        version.performance_impact > 0 
                                            ? 'text-green-500' 
                                            : 'text-red-500'
                                    }`}>
                                        {version.performance_impact > 0 ? '+' : ''}
                                        {version.performance_impact}%
                                    </span>
                                </div>
                            )}
                            {version.benchmark_results && (
                                <div className="mt-4 p-3 bg-got-light-bg/50 dark:bg-got-dark-bg/50 rounded-lg">
                                    <h4 className="text-sm font-medium mb-2">
                                        Resultados de Benchmark
                                    </h4>
                                    <div className="space-y-1">
                                        {version.benchmark_results.map((result, index) => (
                                            <div 
                                                key={index}
                                                className="flex justify-between text-xs"
                                            >
                                                <span>{result.benchmark_name}</span>
                                                <span className="font-medium">
                                                    {result.score.toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Timeline.Item>
                ))}
            </Timeline>
        </Card>
    );
}; 