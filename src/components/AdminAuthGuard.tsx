import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function AdminAuthGuard({ children, allowedRoles }: AdminAuthGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-300">
          Verifying Security Credentials
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Validating encrypted session token with server...
        </p>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!user) {
    return <Navigate to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Role check if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your account ({user.name} · <strong className="text-slate-800">{user.role}</strong>) does not have sufficient authorization privileges to access this area.
          </p>
          <div className="mt-6">
            <Navigate to="/admin" replace />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
