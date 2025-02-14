import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Modelos', href: '/models' },
    { name: 'Rankings', href: '/rankings' },
];

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <nav className="bg-got-dark-card border-b border-got-dark-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link 
                                href="/dashboard" 
                                className="font-got text-2xl font-bold bg-gradient-tech text-transparent bg-clip-text hover-neon"
                            >
                                Lords of AI
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="nav-link font-tech px-3 py-2 rounded-md text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <Link
                                href="/profile"
                                className="nav-link font-tech px-3 py-2 rounded-md text-sm"
                            >
                                Perfil
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="nav-link font-tech px-3 py-2 rounded-md text-sm hover:text-got-primary"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-got-light-text dark:text-got-dark-text hover:text-got-tech"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-got-dark-card border-t border-got-dark-border">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="nav-link font-tech block px-3 py-2 rounded-md text-base"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/profile"
                            className="nav-link font-tech block px-3 py-2 rounded-md text-base"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Perfil
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="nav-link font-tech block w-full text-left px-3 py-2 rounded-md text-base hover:text-got-primary"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}; 