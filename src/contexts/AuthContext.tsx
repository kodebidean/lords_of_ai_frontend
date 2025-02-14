'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { authService } from '@/services/auth';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    isAdmin: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        if (!authService.isAuthenticated()) {
            setLoading(false);
            return;
        }

        try {
            const user = await authService.verifyToken();
            setUser(user);
        } catch (error) {
            console.error('Error checking auth:', error);
            authService.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        setUser,
        loading,
        isAdmin: user?.role === 'admin',
        login: authService.login,
        register: authService.register,
        logout: authService.logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 