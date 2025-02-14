
import { Comment } from '@/types/models';
import api from './api';

export const commentService = {
    async getModelComments(modelId: number): Promise<Comment[]> {
        const response = await api.get(`/models/${modelId}/comments`);
        return response.data.data;
    },

    async addComment(modelId: number, data: {
        content: string;
        parent_id: number | null;
    }): Promise<Comment> {
        const response = await api.post(`/models/${modelId}/comments`, data);
        return response.data.data;
    },

    async updateComment(commentId: number, content: string): Promise<Comment> {
        const response = await api.put(`/comments/${commentId}`, { content });
        return response.data.data;
    },

    async deleteComment(commentId: number): Promise<void> {
        await api.delete(`/comments/${commentId}`);
    }
}; 