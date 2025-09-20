import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, User, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();

    const navigationItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/profile', icon: User, label: 'Profile' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                            "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
                            isActive
                                ? "text-photo-secondary"
                                : "text-muted-foreground"
                        )}
                    >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default Layout;