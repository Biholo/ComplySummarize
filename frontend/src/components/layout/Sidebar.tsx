'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useAuthStore } from '@/stores/authStore';
import { Role } from '@shared/enums';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    FileText,
    Home,
    LogOut,
    Menu,
    Settings,
    Shield,
    Sparkles,
    Upload,
    X
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    roles?: string[];
}

export default function Sidebar() {
    const { isExpanded, setIsExpanded, isMobile } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const allMenuItems: SidebarItem[] = [
        { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
        { icon: <FileText size={20} />, label: 'Documents', href: '/document' },
        { icon: <Upload size={20} />, label: 'Upload', href: '/upload' },
        { icon: <Settings size={20} />, label: 'Profil & Paramètres', href: '/profile' },
        { icon: <Shield size={20} />, label: 'Administration', href: '/admin', roles: ['ROLE_ADMIN'] },
    ];

    // Filter menu items based on user roles
    const menuItems = allMenuItems.filter(item => {
        if (!item.roles) return true;
        if (!user?.roles) return false;
        return item.roles.some((role: string) => user.roles.includes(role as Role));
    });

    const isActive = (path: string) => location.pathname === path;

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Mobile hamburger button
    if (isMobile) {
        return (
            <>
                {/* Mobile hamburger button */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <Menu size={20} className="text-gray-600" />
                </button>

                {/* Mobile overlay */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            />
                            
                            {/* Mobile sidebar */}
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'tween', duration: 0.3 }}
                                className="fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 shadow-xl z-50 lg:hidden"
                            >
                                <div className="flex h-full flex-col p-4">
                                    {/* Close button */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500">
                                                <Sparkles className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h1 className="text-lg font-bold text-gray-900">ComplySummarize</h1>
                                                <span className="text-xs text-gray-500">IA Assistant</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsMobileOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X size={20} className="text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Navigation Items */}
                                    <nav className="flex-1 space-y-2">
                                        {menuItems.map((item) => (
                                            <Link
                                                key={item.label}
                                                to={item.href}
                                                className={`group flex items-center gap-4 rounded-xl p-3 transition-all duration-200 ${
                                                    isActive(item.href)
                                                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <span className={`flex-shrink-0 transition-colors ${
                                                    isActive(item.href) ? 'text-emerald-600' : 'group-hover:text-emerald-500'
                                                }`}>
                                                    {item.icon}
                                                </span>
                                                <span className="whitespace-nowrap text-sm font-medium">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </nav>

                                    {/* User Section */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500">
                                                <div className="h-full w-full flex items-center justify-center text-white text-sm font-semibold">
                                                    U
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {user?.firstName} {user?.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {user?.email}
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={logout}>
                                                <LogOut size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    // Desktop sidebar
    return (
        <motion.div
            animate={{ width: isExpanded ? '280px' : '80px' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-screen flex flex-col bg-white border-r border-gray-200 p-4 shadow-sm z-30"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3 top-8 rounded-full bg-emerald-500 p-1.5 text-white transition-colors hover:bg-emerald-600 shadow-lg z-10"
            >
                <motion.div
                    animate={{ rotate: isExpanded ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronLeft size={16} />
                </motion.div>
            </button>

            {/* Logo Section */}
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex flex-col"
                        >
                            <h1 className="text-lg font-bold text-gray-900">ComplySummarize</h1>
                            <span className="text-xs text-gray-500">IA Assistant</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.href}
                        className={`group flex items-center gap-4 rounded-xl p-3 transition-all duration-200 ${
                            isActive(item.href)
                                ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <span className={`flex-shrink-0 transition-colors ${
                            isActive(item.href) ? 'text-emerald-600' : 'group-hover:text-emerald-500'
                        }`}>
                            {item.icon}
                        </span>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="whitespace-nowrap text-sm font-medium"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                ))}
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500">
                        <div className="h-full w-full flex items-center justify-center text-white text-sm font-semibold">
                            U
                        </div>
                    </div>
                    <AnimatePresence>
                        {isExpanded && (
                    <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex-1 min-w-0"
                            >
                                <div className="text-sm font-medium text-gray-900 truncate">
                                    {user?.firstName} {user?.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.email}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {isExpanded && (
                        <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={logout}>
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
