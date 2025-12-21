import { createContext, useContext, useState, useEffect,type  ReactNode } from 'react';
import type { Account } from '../services/auth';

interface AuthContextType {
  token: string | null;
  account: Account | null;
  isAuthenticated: boolean;
  login: (token: string, account: Account) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    // Check localStorage for existing token and account on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedAccount = localStorage.getItem('auth_account');
    
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedAccount) {
      try {
        setAccount(JSON.parse(storedAccount));
      } catch (error) {
        console.error('Failed to parse stored account:', error);
        localStorage.removeItem('auth_account');
      }
    }
  }, []);

  const login = (newToken: string, newAccount: Account) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_account', JSON.stringify(newAccount));
    setToken(newToken);
    setAccount(newAccount);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_account');
    setToken(null);
    setAccount(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, account, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
