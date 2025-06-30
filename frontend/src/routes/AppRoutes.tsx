import { useAutoLogin } from '@/api/queries/authQueries';
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';

import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Sidebar from '@/components/layout/Sidebar';
import Loader from '@/components/ui/Loader/Loader';
import { useSidebar } from '@/contexts/SidebarContext';

import Error from '@/features/Error';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Dashboard from '@/features/document/Dashboard';
import DocumentDetail from '@/features/document/DocumentDetail';
import IndexDocument from '@/features/document/Index';
import Upload from '@/features/document/Upload';
import Profile from '@/features/user/Profile';

import { useAuthStore } from '@/stores/authStore';

const AppRoutes = () => {
    const { isAuthenticated } = useAuthStore();
    const { isExpanded, isMobile } = useSidebar();

    const { refetch: autoLogin, isPending } = useAutoLogin();

    useEffect(() => {
        autoLogin();
    }, [autoLogin]);

    if (isPending) return <Loader />;

    // Calculate margin based on sidebar state
    const getMarginLeft = () => {
        if (!isAuthenticated) return '';
        if (isMobile) return 'ml-0'; // No margin on mobile
        return isExpanded ? 'lg:ml-[280px]' : 'lg:ml-[80px]'; // Dynamic margin on desktop
    };

    return (
        <div className="min-h-screen">
            {isAuthenticated && <Sidebar />}
            <main 
                className={`min-h-screen overflow-auto transition-all duration-300 ${getMarginLeft()}`}
            >
                <Routes>
                    {/* Routes publiques */}
                    <Route element={<PublicRoutes />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Routes privées */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/document" element={<IndexDocument />} />
                        <Route path="/document/:id" element={<DocumentDetail />} />
                        <Route path="/upload" element={<Upload />} />
                    </Route>

                    {/* Route par défaut */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/error" element={<Error />} />
                </Routes>
            </main>
        </div>
    );
};

export default AppRoutes;
