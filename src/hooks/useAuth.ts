import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types/auth';
import { authService } from '@/services/auth';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authService.verifyToken();
                setUser(user);
            } catch (error) {
                console.error('Auth check error:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const isAdmin = user?.role === 'admin';

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.user);
        router.push('/dashboard');
    };

    const register = async (userData: {
        username: string;
        email: string;
        password: string;
        bio?: string;
    }) => {
        const response = await authService.register(userData);
        setUser(response.user);
        router.push('/dashboard');
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (userData: {
        username?: string;
        email?: string;
        bio?: string;
        password?: string;
        currentPassword?: string;
    }) => {
        try {
            const response = await authService.updateProfile(userData);
            context.setUser(response);
            return response;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    return {
        ...context,
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateProfile
    };
}; 