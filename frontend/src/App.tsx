import { SidebarProvider } from '@/contexts/SidebarContext';
import AppRoutes from '@/routes/AppRoutes';

function App() {
    return (
        <SidebarProvider>
            <AppRoutes />
        </SidebarProvider>
    );
}

export default App;
