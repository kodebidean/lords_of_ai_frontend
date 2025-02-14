import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-got-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Efectos de fondo */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-got-primary/20 to-got-secondary/20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-tech" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-tech" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <h1 className="text-center font-got text-4xl bg-gradient-tech text-transparent bg-clip-text animate-float mb-2">
                    Lords of AI
                </h1>
                <h2 className="mt-6 text-center text-2xl font-got text-got-dark-text">
                    {title}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="card border-gradient p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}; 