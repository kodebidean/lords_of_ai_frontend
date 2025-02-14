export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    bio?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    bio?: string;
}

export interface ValidationError {
    msg: string;
    param?: string;
    location?: string;
} 