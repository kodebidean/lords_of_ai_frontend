'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface ErrorResponse {
    error: string;
}

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        bio: ''
    });

    const passwordRequirements = [
        'Mínimo 8 caracteres',
        'Al menos una letra mayúscula',
        'Al menos una letra minúscula',
        'Al menos un número'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(formData);
            router.push('/login');
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
                </div>

                <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">La contraseña debe tener:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {passwordRequirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
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