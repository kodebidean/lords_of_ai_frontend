import { ReactNode } from 'react';
import Link from 'next/link';
import { 
    HomeIcon, 
    ComputerDesktopIcon,
    TrophyIcon,
    ChartBarIcon,
    UserIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
    children: ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Modelos IA', href: '/models', icon: ComputerDesktopIcon },
    { name: 'Rankings', href: '/rankings', icon: TrophyIcon },
    { name: 'Estadísticas', href: '/statistics', icon: ChartBarIcon },
    { name: 'Perfil', href: '/profile', icon: UserIcon },
];

export const Sidebar = ({ children }: SidebarProps) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <span className="text-xl font-semibold">Lords of AI</span>
                        </div>
                        <div className="mt-5 flex-grow flex flex-col">
                            <nav className="flex-1 px-2 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    >
                                        <item.icon
                                            className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
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