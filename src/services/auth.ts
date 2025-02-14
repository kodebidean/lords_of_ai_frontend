import api from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';
import Cookies from 'js-cookie';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/users/login', credentials);
        if (data.token) {
            Cookies.set('token', data.token, { expires: 7 }); // Cookie expira en 7 días
            localStorage.setItem('token', data.token); // Mantener para compatibilidad
        }
        return data;
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/users/register', credentials);
        if (data.token) {
            Cookies.set('token', data.token, { expires: 7 });
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    async getProfile(): Promise<User> {
        const { data } = await api.get<{ user: User }>('/users/profile');
        return data.user;
    },

    async updateProfile(profileData: Partial<User>): Promise<User> {
        const { data } = await api.put<{ user: User }>('/users/profile', profileData);
        return data.user;
    },

    logout(): void {
        Cookies.remove('token');
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    isAuthenticated(): boolean {
        return !!Cookies.get('token');
    }
}; 