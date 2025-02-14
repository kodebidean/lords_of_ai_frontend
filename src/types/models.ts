export interface Category {
    category_id: number;
    category_name: string;
}

export interface AiModel {
    model_id: number;
    name: string;
    developer: string;
    category_id: number;
    category_name: string;
    description: string;
    release_date: string;
    score: number;
    vote_score: number;
    likes: number;
    dislikes: number;
    metrics_count: number;
    created_at: string;
    updated_at: string;
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
    model_id: number;
    characteristic_name: string;
    value: number;
    created_at: string;
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