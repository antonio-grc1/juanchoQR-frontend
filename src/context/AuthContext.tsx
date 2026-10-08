import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  authReady: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isValidador: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');

    try {
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUsuario(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    } finally {
      setAuthReady(true);
    }
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    const data = await authApi.loginAdmin(email, password);
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setToken(data.accessToken);
    setUsuario(data.usuario);
  };

  const loginGoogle = async (idToken: string) => {
    const data = await authApi.loginGoogle(idToken);
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setToken(data.accessToken);
    setUsuario(data.usuario);
  };

  const logout = async () => {
    await authApi.logout();
    setToken(null);
    setUsuario(null);
  };

  const isAuthenticated = !!usuario && !!token;
  const isAdmin = usuario?.rol === 'ADMIN';
  const isValidador = usuario?.rol === 'VALIDADOR' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        authReady,
        isAuthenticated,
        isAdmin,
        isValidador,
        loginAdmin,
        loginGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
