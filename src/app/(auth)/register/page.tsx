'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AxiosError } from 'axios';

interface ErrorResponse {
    error: string;
}

export default function RegisterPage() {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        bio: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(formData);
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            setError(error.response?.data?.error || 'Error al registrar usuario');
            console.error('Register error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <AuthLayout title="Crear Cuenta">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-got-primary/20 text-got-primary p-3 rounded-md text-sm font-tech border border-got-primary/30">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Nombre de usuario"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        className="input-got font-tech"
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="input-got font-tech"
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="input-got font-tech"
                    />

                    <div>
                        <label className="block text-sm font-medium text-got-light-text dark:text-got-dark-text mb-1 font-tech">
                            Bio (opcional)
                        </label>
                        <textarea
                            name="bio"
                            rows={3}
                            value={formData.bio}
                            onChange={handleChange}
                            className="input-got font-tech w-full resize-none"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full btn-primary hover:shadow-neon"
                    isLoading={isLoading}
                >
                    Registrarse
                </Button>

                <div className="text-sm text-center font-tech">
                    <Link 
                        href="/login" 
                        className="text-got-tech hover:text-got-tech/80 transition-colors duration-200"
                    >
                        ¿Ya tienes una cuenta? Inicia sesión
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
} 