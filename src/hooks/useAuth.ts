import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types/auth';
import { authService } from '../services/auth';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = await authService.getProfile();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

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

    return {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
}; 