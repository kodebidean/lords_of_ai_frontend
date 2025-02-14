import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-extrabold text-white mb-2">
                    Lords of AI
                </h1>
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-300">
                    {title}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}; 