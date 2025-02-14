import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Interceptor para debuggear
api.interceptors.request.use(request => {
    console.log('Request:', {
        url: request.url,
        method: request.method,
        params: request.params,
        data: request.data
    });
    return request;
});

api.interceptors.response.use(
    response => {
        console.log('Response:', response.data);
        return response;
    },
    error => {
        console.error('Error Response:', error.response?.data);
        return Promise.reject(error);
    }
);

export default api; 