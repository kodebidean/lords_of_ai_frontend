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
                    <div className="bg-got-primary/20 text-got-primary p-3 rounded-md text-sm font-tech border border-got-primary/30">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
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
                        autoComplete="current-password"
                        className="input-got font-tech"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full btn-primary hover:shadow-neon"
                    isLoading={isLoading}
                >
                    Iniciar Sesión
                </Button>

                <div className="text-sm text-center font-tech">
                    <Link 
                        href="/register" 
                        className="text-got-tech hover:text-got-tech/80 transition-colors duration-200"
                    >
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
} 