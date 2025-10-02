import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAppStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};