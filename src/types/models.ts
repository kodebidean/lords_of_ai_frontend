export interface Category {
    category_id: number;
    category_name: string;
    description?: string;
    parent_category_id?: number;
    icon_url?: string;
}

export interface AiModel {
    model_id: number;
    name: string;
    developer: string;
    description: string;
    release_date: string;
    category_id: number;
    category: Category;
    characteristics: ModelMetric[];
    score: number;
    vote_score?: number;
    likes?: number;
    dislikes?: number;
    benchmark_results?: BenchmarkResult[];
    versions?: ModelVersion[];
    comments?: Comment[];
}

export interface ModelCharacteristic {
    characteristic_id: number;
    model_id: number;
    characteristic_name: string;
    value: number;
    created_at: string;
}

export interface ScoreHistory {
    history_id: number;
    model_id: number;
    score: number;
    recorded_at: string;
}

export interface ModelStatistics {
    likes: number;
    dislikes: number;
    score_history: ScoreHistory[];
    characteristics: ModelCharacteristic[];
}

export interface GetModelsParams {
    category?: string;
    limit?: number;
    offset?: number;
}

export interface ModelsResponse {
    success: boolean;
    data: AiModel[];
    total: number;
}

export interface ModelResponse {
    success: boolean;
    data: AiModel;
}

export interface StatisticsResponse {
    success: boolean;
    data: ModelStatistics;
}

export interface ModelMetric {
    characteristic_id: number;
    characteristic_name: string;
    value: number;
    confidence_level: number;
    category: {
        category_id: number;
        category_name: string;
    };
}

export interface ModelStatistic {
    stat_id: number;
    metric: string;
    value: number;
    measured_at: string;
}

export interface ModelRanking {
    ranking_id: number;
    category: string;
    rank: number;
    score: number;
    updated_at: string;
}

export interface MetricsResponse {
    success: boolean;
    data: ModelMetric[];
}

export interface VoteResponse {
    success: boolean;
    message: string;
}

export interface BenchmarkResult {
    benchmark_id: number;
    benchmark_name: string;
    score: number;
    execution_time?: number;
    memory_usage?: number;
    test_date: string;
}

export interface ModelVersion {
    version_id: number;
    version_number: string;
    release_date: string;
    changes_description: string;
    is_major_update: boolean;
    performance_impact?: number;
    benchmark_results?: BenchmarkResult[];
}

export interface User {
    user_id: number;
    username: string;
    avatar_url?: string;
}

export interface Comment {
    comment_id: number;
    content: string;
    user: User;
    created_at: string;
    updated_at?: string;
    parent_id?: number | null;
    replies?: Comment[];
}

export interface FilterOptions {
    category?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    query?: string;
    releaseDate?: string;
    developer?: string;
    minScore?: number;
    maxScore?: number;
    timeRange?: string;
    sortBy?: 'score' | 'name' | 'release_date';
    sortOrder?: 'asc' | 'desc';
} 