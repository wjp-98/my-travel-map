import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import request from '@/utils/request';

export interface User {
  username: string;
  phone: string;
  email: string;
  avatar?: string;
  birthday: {
    year: number;
    month: number;
    day: number;
  }
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const router = useRouter();

  // 初始化时从 localStorage 获取 token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (storedToken && storedUser && tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      if (expiryDate > new Date()) {
        setTokenState(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Token 已过期，清除存储
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
      }
    }
  }, []);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('token', newToken);
  };

  const removeToken = () => {
    setTokenState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    router.push('/login');
  };

  const login = (userData: User, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    
    // 设置 token 过期时间为 1 天后
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    
    // 存储到 localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokenExpiry', expiryDate.toISOString());
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const { data } = await request.get('/auth/verify');
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    token,
    setToken,
    removeToken,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 