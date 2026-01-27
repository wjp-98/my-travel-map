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
  token: string | null; // accessToken
  refreshToken: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  removeToken: () => void;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const router = useRouter();

  // 刷新 token 的函数
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const currentRefreshToken = localStorage.getItem('refreshToken');
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await request.post('/auth/refresh-token', {}, {
        headers: {
          'X-Refresh-Token': currentRefreshToken,
        },
      });

      if (response.data.success && response.data.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // 更新 tokens
        setTokenState(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          setRefreshTokenState(newRefreshToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        
        // 更新过期时间
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 60);
        localStorage.setItem('tokenExpiry', expiryDate.toISOString());
        
        return newAccessToken;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      // 刷新失败，清除所有认证信息
      setTokenState(null);
      setRefreshTokenState(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      router.push('/login');
      return null;
    }
  };

  // 初始化时从 localStorage 获取 token
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (storedAccessToken && storedRefreshToken && storedUser && tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      if (expiryDate > new Date()) {
        setTokenState(storedAccessToken);
        setRefreshTokenState(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Token 已过期，尝试刷新
        refreshAccessToken().catch(() => {
          // 刷新失败已在 refreshAccessToken 中处理
        });
      }
    }
  }, []);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('accessToken', newToken);
  };

  const setRefreshToken = (newRefreshToken: string) => {
    setRefreshTokenState(newRefreshToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  };

  const removeToken = () => {
    setTokenState(null);
    setRefreshTokenState(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    router.push('/login');
  };

  const login = (userData: User, accessToken: string, refreshTokenValue: string) => {
    setUser(userData);
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    
    // 设置 access token 过期时间为 60 分钟后
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 60);
    
    // 存储到 localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshTokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokenExpiry', expiryDate.toISOString());
  };


  const logout = () => {
    setUser(null);
    removeToken();
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return;
      }

      const { data } = await request.get('/auth/verify');
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const value = {
    user,
    token,
    refreshToken,
    setToken,
    setRefreshToken,
    removeToken,
    isAuthenticated: !!token,
    login,
    logout,
    refreshAccessToken,
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