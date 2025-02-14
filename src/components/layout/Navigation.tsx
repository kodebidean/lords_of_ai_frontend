import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    HomeIcon,
    ChartBarIcon,
    ArrowsRightLeftIcon,
    Cog6ToothIcon,
    UserIcon
} from '@heroicons/react/24/outline';

export const Navigation = () => {
    const pathname = usePathname();
    const { isAuthenticated, isAdmin } = useAuth();

    const routes = [
        {
            name: 'Inicio',
            href: '/',
            icon: HomeIcon,
            public: true
        },
        {
            name: 'Estadísticas',
            href: '/statistics',
            icon: ChartBarIcon,
            public: true
        },
        {
            name: 'Comparar',
            href: '/compare',
            icon: ArrowsRightLeftIcon,
            public: true
        },
        {
            name: 'Admin',
            href: '/admin/models',
            icon: Cog6ToothIcon,
            admin: true
        },
        {
            name: 'Perfil',
            href: '/profile',
            icon: UserIcon,
            auth: true
        }
    ];

    const filteredRoutes = routes.filter(route => {
        if (route.admin) return isAdmin;
        if (route.auth) return isAuthenticated;
        return route.public;
    });

    return (
        <nav className="flex space-x-1 p-1 bg-got-light-bg/50 dark:bg-got-dark-bg/50 rounded-lg backdrop-blur-sm">
            {filteredRoutes.map(route => {
                const isActive = pathname === route.href;
                return (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={`
                            flex items-center space-x-2 px-4 py-2 rounded-md transition-colors
                            ${isActive 
                                ? 'bg-got-tech text-white' 
                                : 'hover:bg-got-tech/10 text-got-light-text dark:text-got-dark-text'
                            }
                        `}
                    >
                        <route.icon className="h-5 w-5" />
                        <span>{route.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}; 