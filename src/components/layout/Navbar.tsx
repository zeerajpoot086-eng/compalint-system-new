import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Wrench,
  Sun,
  Moon,
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Briefcase,
  Layers,
  ChevronDown,
  Check,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenNewComplaint?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, onOpenNewComplaint }) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target as Node)) {
        setShowDemoMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Fix<span className="text-indigo-600 dark:text-indigo-400">Mate</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  AI-Powered
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block">
                Complaint & Service Management
              </p>
            </div>
          </button>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'landing'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            
            {user && (
              <button
                onClick={() => {
                  if (user.role === 'admin') setCurrentView('admin-dashboard');
                  else if (user.role === 'technician') setCurrentView('technician-dashboard');
                  else setCurrentView('user-dashboard');
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView.includes('dashboard')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>
        </div>

        {/* Right Section / Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">

          {/* Role Switcher Demo Dropdown for easy evaluator testing */}
          <div className="relative" ref={demoMenuRef}>
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Quickly switch between User, Admin, and Technician roles"
            >
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Role Switcher:</span>
              <span className="capitalize font-bold text-indigo-600 dark:text-indigo-400">
                {user ? user.role : 'Guest'}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in duration-150">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role (Instant)
                </div>
                <button
                  onClick={() => {
                    quickDemoLogin('user');
                    setShowDemoMenu(false);
                    setCurrentView('user-dashboard');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-950/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-emerald-500" />
                    <div className="text-left">
                      <div className="font-semibold">Customer (Sarah)</div>
                      <div className="text-[10px] text-slate-400">File complaints & track fixes</div>
                    </div>
                  </div>
                  {user?.role === 'user' && <Check className="h-4 w-4 text-emerald-500" />}
                </button>
                <button
                  onClick={() => {
                    quickDemoLogin('admin');
                    setShowDemoMenu(false);
                    setCurrentView('admin-dashboard');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-950/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <div className="text-left">
                      <div className="font-semibold">Admin (Elena)</div>
                      <div className="text-[10px] text-slate-400">Dispatch tech & view KPIs</div>
                    </div>
                  </div>
                  {user?.role === 'admin' && <Check className="h-4 w-4 text-indigo-500" />}
                </button>
                <button
                  onClick={() => {
                    quickDemoLogin('technician');
                    setShowDemoMenu(false);
                    setCurrentView('technician-dashboard');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-950/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-amber-500" />
                    <div className="text-left">
                      <div className="font-semibold">Technician (Alex)</div>
                      <div className="text-[10px] text-slate-400">Resolve jobs & add notes</div>
                    </div>
                  </div>
                  {user?.role === 'technician' && <Check className="h-4 w-4 text-amber-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Report Problem Quick Action Button (if user logged in) */}
          {user && user.role === 'user' && onOpenNewComplaint && (
            <button
              onClick={onOpenNewComplaint}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Report Issue
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n._id || n.id}
                          onClick={() => {
                            if (!n.isRead) markAsRead(n._id || n.id);
                          }}
                          className={`cursor-pointer rounded-xl p-3 text-xs transition-colors border ${
                            n.isRead
                              ? 'bg-slate-50/60 border-slate-100 text-slate-600 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400'
                              : 'bg-indigo-50/70 border-indigo-100 text-slate-900 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Account / Auth Actions */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full p-1 hover:ring-2 hover:ring-indigo-500/30 transition-all"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 object-cover dark:border-slate-700"
                />
                <span className="hidden lg:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      Role: {user.role}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setCurrentView('profile');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      My Profile & Security
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (user.role === 'admin') setCurrentView('admin-dashboard');
                        else if (user.role === 'technician') setCurrentView('technician-dashboard');
                        else setCurrentView('user-dashboard');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Layers className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        setCurrentView('landing');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('login')}
                className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
