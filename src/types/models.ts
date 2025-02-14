export interface AiModel {
    model_id: number;
    name: string;
    developer: string;
    release_date: string;
    description: string;
    category: 'text' | 'image' | 'video' | 'audio' | 'code' | 'multimodal';
    rank?: number;
    score?: number;
    total_votes?: number;
    vote_score?: number;
    statistics?: ModelStatistic[];
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