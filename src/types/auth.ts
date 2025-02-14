export interface User {
    user_id: number;
    username: string;
    email: string;
    profile_image_url?: string;
    bio?: string;
    created_at: string;
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