import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi, type CustomerAuthUser } from '@/services/api';
import { httpClient } from '@/services/api/http-client';

const STORAGE_KEY = 'customer_auth_token';

interface CustomerAuthContextType {
  user: CustomerAuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerAuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEY);
    if (!savedToken) {
      setIsInitializing(false);
      return;
    }

    httpClient.setToken(savedToken);
    setToken(savedToken);

    authApi
      .me()
      .then((result) => setUser(result.user))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        httpClient.setToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsInitializing(false));
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    localStorage.setItem(STORAGE_KEY, result.token);
    httpClient.setToken(result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await authApi.signup({ name, email, password });
    localStorage.setItem(STORAGE_KEY, result.token);
    httpClient.setToken(result.token);
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    httpClient.setToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo<CustomerAuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!user,
      isInitializing,
      login,
      signup,
      logout,
    }),
    [user, token, isInitializing],
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}

export function RequireCustomerAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useCustomerAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="container mx-auto px-6 py-20 text-center text-muted-foreground">
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/account/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}
