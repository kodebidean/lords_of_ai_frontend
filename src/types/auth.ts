export interface User {
    id: number;
    email: string;
    username: string;
    role: 'admin' | 'user';
    bio?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    username: string;
    bio?: string;
} 