import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    HomeIcon, 
    ComputerDesktopIcon,
    TrophyIcon,
    ChartBarIcon,
    UserIcon,
    BeakerIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
    children: ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Modelos IA', href: '/models', icon: ComputerDesktopIcon },
    { name: 'Rankings', href: '/rankings', icon: TrophyIcon },
    { name: 'Estadísticas', href: '/statistics', icon: ChartBarIcon },
    { name: 'Avanzado', href: '/advanced', icon: BeakerIcon },
    { name: 'Perfil', href: '/profile', icon: UserIcon },
];

export const Sidebar = ({ children }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-got-light-bg dark:bg-got-dark-bg">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-got-light-card dark:bg-got-dark-card border-r border-got-light-border dark:border-got-dark-border">
                        <div className="flex flex-col flex-grow px-4">
                            <nav className="flex-1 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`
                                                group flex items-center px-4 py-2 text-sm font-tech rounded-lg transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-gradient-tech text-white shadow-neon' 
                                                    : 'text-got-light-text dark:text-got-dark-text hover:bg-got-tech/10 hover:text-got-tech'
                                                }
                                            `}
                                        >
                                            <item.icon
                                                className={`
                                                    mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200
                                                    ${isActive 
                                                        ? 'text-white' 
                                                        : 'text-got-light-text dark:text-got-dark-text group-hover:text-got-tech'
                                                    }
                                                `}
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                            
                            {/* Decorative elements */}
                            <div className="mt-auto pb-6">
                                <div className="h-px bg-gradient-tech my-6" />
                                <div className="px-4 py-3 text-xs font-tech text-got-light-text dark:text-got-dark-text opacity-70">
                                    Lords of AI © 2024
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 