
import { BenchmarkResult } from '@/types/models';
import api from './api';

export const benchmarkService = {
    async getModelBenchmarks(modelId: number): Promise<BenchmarkResult[]> {
        const response = await api.get(`/models/${modelId}/benchmarks`);
        return response.data.data;
    },

    async addBenchmarkResult(modelId: number, data: {
        benchmark_id: number;
        score: number;
        execution_time?: number;
        memory_usage?: number;
    }): Promise<BenchmarkResult> {
        const response = await api.post(`/models/${modelId}/benchmarks`, data);
        return response.data.data;
    },

    async getBenchmarkHistory(modelId: number, benchmarkId: number): Promise<BenchmarkResult[]> {
        const response = await api.get(`/models/${modelId}/benchmarks/${benchmarkId}/history`);
        return response.data.data;
    },

    async compareBenchmarks(modelId1: number, modelId2: number, benchmarkId: number) {
        const response = await api.get(`/benchmarks/compare`, {
            params: { model1: modelId1, model2: modelId2, benchmark: benchmarkId }
        });
        return response.data.data;
    }
}; 