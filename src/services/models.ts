import api from './api';
import { AiModel, ModelRanking, ModelStatistic, ModelMetric, ModelsResponse } from '../types/models';

interface GetModelsParams {
    category?: string;
    page?: number;
    limit?: number;
}

export const modelService = {
    async getModels(params?: GetModelsParams): Promise<ModelsResponse> {
        try {
            const queryParams = {
                ...params,
                category: params?.category ? String(params.category) : undefined,
                page: params?.page ? String(params.page) : '1',
                limit: params?.limit ? String(params.limit) : '5'
            };

            const { data } = await api.get('/ai-models', { 
                params: queryParams 
            });
            return data;
        } catch (error) {
            console.error('Error fetching models:', error);
            throw error;
        }
    },

    async getModelById(id: number) {
        const { data } = await api.get(`/api/models/${id}`);
        return data;
    },

    async getModelMetrics(modelId: number): Promise<ModelMetric[]> {
        const { data } = await api.get(`/api/models/${modelId}/metrics`);
        return data;
    },

    async createModel(modelData: Partial<AiModel>) {
        const { data } = await api.post('/models', modelData);
        return data.data;
    },

    async updateModel(id: number, modelData: Partial<AiModel>) {
        const { data } = await api.put(`/models/${id}`, modelData);
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

    async voteModel(modelId: number, value: 1 | -1) {
        const { data } = await api.post(`/api/models/${modelId}/vote`, { value });
        return data;
    },

    async getModelStatistics(id: number): Promise<ModelStatistic> {
        const { data } = await api.get(`/models/${id}/statistics`);
        return data;
    },

    async deleteModel(id: number) {
        const { data } = await api.delete(`/models/${id}`);
        return data;
    },

    async deleteModelMetrics(modelId: number, metricId: number) {
        const { data } = await api.delete(`/models/${modelId}/metrics/${metricId}`);
        return data;
    },

    async addModelMetrics(modelId: number, metricData: Omit<ModelMetric, 'characteristic_id' | 'model_id' | 'created_at'>) {
        const { data } = await api.post(`/models/${modelId}/metrics`, metricData);
        return data.data;
    },
}; 