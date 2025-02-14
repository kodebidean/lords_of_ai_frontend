import { api } from './api';
import { AiModel, ModelRanking, ModelStatistic } from '../types/models';

interface GetModelsParams {
    category?: string;
    page?: number;
    limit?: number;
}

interface ModelsResponse {
    data: AiModel[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export const modelService = {
    async getModels(params?: GetModelsParams): Promise<ModelsResponse> {
        const { data } = await api.get('/ai-models', { params });
        return data;
    },

    async getModelById(id: number): Promise<AiModel> {
        const { data } = await api.get(`/ai-models/${id}`);
        return data.data;
    },

    async createModel(modelData: Partial<AiModel>): Promise<AiModel> {
        const { data } = await api.post('/ai-models', modelData);
        return data.data;
    },

    async updateModel(id: number, modelData: Partial<AiModel>): Promise<AiModel> {
        const { data } = await api.put(`/ai-models/${id}`, modelData);
        return data.data;
    },

    async updateStatistics(
        modelId: number, 
        statistics: Partial<ModelStatistic>
    ): Promise<ModelStatistic> {
        const { data } = await api.post(`/ai-models/${modelId}/statistics`, statistics);
        return data.data;
    },

    async updateRanking(
        modelId: number, 
        ranking: Partial<ModelRanking>
    ): Promise<ModelRanking> {
        const { data } = await api.post(`/ai-models/${modelId}/ranking`, ranking);
        return data.data;
    },

    async voteModel(modelId: number, vote: 1 | -1): Promise<void> {
        await api.post(`/ai-models/${modelId}/vote`, { vote });
    }
}; 