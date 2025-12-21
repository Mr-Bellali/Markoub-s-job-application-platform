import { createContext, useContext, useState, useEffect,type  ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing token on mount
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
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
