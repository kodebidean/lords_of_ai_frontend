import { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '../common';
import { Comment } from '@/types/models';

import { formatDate } from '@/utils/date';
import { useAuth } from '@/hooks/useAuth';
import { commentService } from '@/services/comments';

interface Props {
    modelId: number;
    className?: string;
}

export const ModelDiscussion = ({ modelId, className = '' }: Props) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const fetchComments = useCallback(async () => {
        try {
            const data = await commentService.getModelComments(modelId);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }, [modelId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isLoading) return;

        setIsLoading(true);
        try {
            await commentService.addComment(modelId, {
                content: newComment,
                parent_id: null
            });
            setNewComment('');
            await fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className={className}>
            <h3 className="text-xl font-got mb-6">Discusión</h3>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-got-tech focus:ring-got-tech"
                        rows={3}
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading || !newComment.trim()}
                        className="mt-2"
                    >
                        {isLoading ? 'Enviando...' : 'Comentar'}
                    </Button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-got-light-bg/50 dark:bg-got-dark-bg/50 rounded-lg text-center">
                    <p className="text-got-light-text dark:text-got-dark-text">
                        Inicia sesión para participar en la discusión
                    </p>
                </div>
            )}

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div 
                        key={comment.comment_id}
                        className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6"
                    >
                        <div className="flex items-center mb-2">
                            <span className="font-medium">{comment.user.username}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm text-got-light-text dark:text-got-dark-text">
                                {formatDate(comment.created_at)}
                            </span>
                        </div>
                        <p className="text-got-light-text dark:text-got-dark-text">
                            {comment.content}
                        </p>
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 ml-6 space-y-4">
                                {comment.replies.map((reply) => (
                                    <div key={reply.comment_id}>
                                        <div className="flex items-center mb-1">
                                            <span className="font-medium text-sm">
                                                {reply.user.username}
                                            </span>
                                            <span className="mx-2 text-sm">•</span>
                                            <span className="text-xs text-got-light-text dark:text-got-dark-text">
                                                {formatDate(reply.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-got-light-text dark:text-got-dark-text">
                                            {reply.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}; 