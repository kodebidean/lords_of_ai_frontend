'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/common';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || ''
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            await updateProfile({
                ...formData,
                password: formData.newPassword || undefined
            });
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-got mb-8 bg-gradient-tech text-transparent bg-clip-text">
                    Perfil de Usuario
                </h1>

                <div className="bg-got-dark-card rounded-lg p-6">
                    {error && (
                        <div className="mb-4 bg-got-primary/20 text-got-primary p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Nombre de usuario"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full rounded-md bg-got-dark-bg"
                                />
                            </div>

                            {isEditing && (
                                <>
                                    <Input
                                        label="Contraseña actual"
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Nueva contraseña"
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Confirmar contraseña"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex justify-end space-x-4">
                            {isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        isLoading={loading}
                                    >
                                        Guardar cambios
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar perfil
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
} 