import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { CreateComplaintModal } from './components/complaints/CreateComplaintModal';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Auto-route on initial auth load
  useEffect(() => {
    if (!isLoading && user && currentView === 'landing') {
      if (user.role === 'admin') setCurrentView('admin-dashboard');
      else if (user.role === 'technician') setCurrentView('technician-dashboard');
      else setCurrentView('user-dashboard');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-xs font-semibold text-slate-500">Initializing FixMate Engine...</p>
        </div>
      </div>
    );
  }

  const isDashboardView = ['user-dashboard', 'admin-dashboard', 'technician-dashboard', 'profile'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenNewComplaint={() => setIsReportModalOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar (shown on internal dashboard views for logged-in users) */}
        {user && isDashboardView && (
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenNewComplaint={() => setIsReportModalOpen(true)}
          />
        )}

        {/* Dynamic View Route Container */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {currentView === 'landing' && (
            <LandingPage
              setCurrentView={setCurrentView}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}

          {currentView === 'login' && (
            <LoginPage setCurrentView={setCurrentView} />
          )}

          {currentView === 'register' && (
            <RegisterPage setCurrentView={setCurrentView} />
          )}

          {currentView === 'user-dashboard' && (
            <UserDashboard onOpenReportModal={() => setIsReportModalOpen(true)} />
          )}

          {currentView === 'admin-dashboard' && (
            <AdminDashboard />
          )}

          {currentView === 'technician-dashboard' && (
            <TechnicianDashboard />
          )}

          {currentView === 'profile' && (
            <ProfilePage />
          )}

          {/* Footer on public landing view */}
          {currentView === 'landing' && <Footer setCurrentView={setCurrentView} />}
        </main>
      </div>

      {/* Global New Complaint Creation Modal */}
      <CreateComplaintModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => {
          setIsReportModalOpen(false);
          setCurrentView('user-dashboard');
        }}
      />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
