import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

interface SidebarProviderProps {
    children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsExpanded(false); // Auto-collapse on mobile
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded, isMobile }}>
            {children}
        </SidebarContext.Provider>
    );
}; 