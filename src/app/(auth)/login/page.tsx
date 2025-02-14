'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
        } catch (err) {
            setError('Credenciales inválidas');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <AuthLayout title="Iniciar Sesión">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                />

                <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                />

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                >
                    Iniciar Sesión
                </Button>

                <div className="text-sm text-center">
                    <Link 
                        href="/register" 
                        className="font-medium text-indigo-400 hover:text-indigo-300"
                    >
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
} 