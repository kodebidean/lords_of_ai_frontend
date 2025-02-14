import axios from 'axios';
import { AiModel, ModelRanking, ModelStatistic, ModelMetric, Category } from '../types/models';

interface GetModelsParams {
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    category?: string;
    timeRange?: 'week' | 'month' | 'year';
}

interface ModelComparison {
    model1: AiModel;
    model2: AiModel;
    differences: {
        category: string;
        value1: number;
        value2: number;
    }[];
}

interface ModelHistory {
    date: string;
    score: number;
    benchmarks: {
        name: string;
        value: number;
    }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const modelService = {
    async getModels(params?: GetModelsParams): Promise<AiModel[]> {
        try {
            const response = await axios.get<AiModel[]>(`${API_URL}/models`, { params });
            const models = Array.isArray(response.data) ? response.data : [];
            return models.map(model => ({
                ...model,
                score: model.score || 0
            }));
        } catch (error) {
            console.error('Error fetching models:', error);
            return [];
        }
    },

    async getModelById(id: number): Promise<AiModel | null> {
        try {
            const response = await axios.get<AiModel>(`${API_URL}/models/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching model:', error);
            return null;
        }
    },

    async getModelMetrics(modelId: number): Promise<ModelMetric[]> {
        const { data } = await axios.get<ModelMetric[]>(`${API_URL}/api/models/${modelId}/metrics`);
        return data;
    },

    async createModel(modelData: Partial<AiModel>) {
        const { data } = await axios.post<AiModel>(`${API_URL}/models`, modelData);
        return data;
    },

    async updateModel(id: number, modelData: Partial<AiModel>) {
        const { data } = await axios.put<AiModel>(`${API_URL}/models/${id}`, modelData);
        return data;
    },

    async updateStatistics(
        modelId: number, 
        statistics: Partial<ModelStatistic>
    ): Promise<ModelStatistic> {
        const { data } = await axios.post<ModelStatistic>(`${API_URL}/ai-models/${modelId}/statistics`, statistics);
        return data;
    },

    async updateRanking(
        modelId: number, 
        ranking: Partial<ModelRanking>
    ): Promise<ModelRanking> {
        const { data } = await axios.post<ModelRanking>(`${API_URL}/ai-models/${modelId}/ranking`, ranking);
        return data;
    },

    async voteModel(modelId: number, value: number) {
        try {
            const response = await axios.post(`${API_URL}/models/${modelId}/vote`, { value });
            return response.data;
        } catch (error) {
            console.error('Error voting model:', error);
            throw error;
        }
    },

    async getModelStatistics(id: number): Promise<ModelStatistic> {
        const { data } = await axios.get<ModelStatistic>(`${API_URL}/models/${id}/statistics`);
        return data;
    },

    async deleteModel(id: number) {
        const { data } = await axios.delete<{ data: boolean }>(`${API_URL}/models/${id}`);
        return data;
    },

    async deleteModelMetrics(modelId: number, metricId: number) {
        const { data } = await axios.delete<{ data: boolean }>(`${API_URL}/models/${modelId}/metrics/${metricId}`);
        return data;
    },

    async addModelMetrics(modelId: number, metricData: Omit<ModelMetric, 'characteristic_id' | 'model_id' | 'created_at'>) {
        const { data } = await axios.post<ModelMetric>(`${API_URL}/models/${modelId}/metrics`, metricData);
        return data;
    },

    async getModelsByCategory(categoryId: number): Promise<AiModel[]> {
        const response = await axios.get<{ data: AiModel[] }>(`${API_URL}/models/category/${categoryId}`);
        return response.data.data;
    },

    async compareModels(modelId1: number, modelId2: number) {
        const response = await axios.get<{ data: ModelComparison }>(`${API_URL}/models/compare/${modelId1}/${modelId2}`);
        return response.data.data;
    },

    async searchModels(filters: {
        query?: string;
        category?: string;
        minScore?: number;
        maxDate?: string;
        limit?: number;
        offset?: number;
    }) {
        const response = await axios.get<{ data: AiModel[] }>('/models/search', { params: filters });
        return response.data;
    },

    async getModelHistory(modelId: number, timeRange: '1m' | '3m' | '6m' | '1y') {
        const response = await axios.get<{ data: ModelHistory[] }>(`${API_URL}/models/${modelId}/history`, {
            params: { timeRange }
        });
        return response.data.data;
    },

    async getCategories(): Promise<Category[]> {
        const response = await axios.get<{ data: Category[] }>(`${API_URL}/categories`);
        return response.data.data;
    },

    async getTopModels(limit: number = 10): Promise<AiModel[]> {
        const response = await axios.get<{ data: AiModel[] }>(`${API_URL}/models/top`, {
            params: { limit }
        });
        return response.data.data;
    },

    async getTrendingModels(): Promise<AiModel[]> {
        const response = await axios.get<{ data: AiModel[] }>(`${API_URL}/models/trending`);
        return response.data.data;
    },

    async getFeaturedModels(): Promise<AiModel[]> {
        const response = await fetch('/api/models/featured');
        if (!response.ok) {
            throw new Error('Error fetching featured models');
        }
        return response.json();
    }
}; 