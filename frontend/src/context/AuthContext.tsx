import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (usuario: string, senha: string) => Promise<void>;
  loginDirect: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (usuario: string, senha: string) => {
    const response = await api.login(usuario, senha);
    setToken(response.token);
    setUser(response.usuario);
    localStorage.setItem('token', response.token);
  };

  const loginDirect = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, loginDirect, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

