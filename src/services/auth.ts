import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authService = {
    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            console.log('Enviando datos al servidor:', credentials);
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: credentials.username, email: credentials.email, password: credentials.password }),
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors
                        .map((e: { message: string }) => e.message)
                        .filter(Boolean)
                        .join('. ');
                    console.log('Errores de validación:', data.errors);
                    throw new Error(errorMessages || 'Error de validación');
                }
                throw new Error(data.message || data.error || 'Error en el registro');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            return data;
        } catch (error) {
            console.error('Error completo:', error);
            throw error;
        }
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Error en el inicio de sesión');
        }

        if (data.token) {
            localStorage.setItem('token', data.token);
        }

        return data;
    },

    async verifyToken(): Promise<User | null> {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                localStorage.removeItem('token');
                return null;
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Token verification error:', error);
            localStorage.removeItem('token');
            return null;
        }
    },

    async updateProfile(userData: Partial<User>): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Error al actualizar el perfil');
        }

        return data.user;
    },

    logout() {
        localStorage.removeItem('token');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
}; 