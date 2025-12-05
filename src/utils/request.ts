import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getBaseURL } from '@/config/api';

// 创建axios实例
const request = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 错误消息映射
const errorMessages: Record<number, string> = {
  400: '请求参数错误',
  401: '未登录或登录已过期',
  403: '没有权限访问',
  404: '请求的资源不存在',
  500: '服务器错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
};

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // 处理HTTP错误
    if (error.response) {
      const status = error.response.status;
      const errorMessage = errorMessages[status] || '请求失败';
      
      // 如果是401错误，清除token并跳转到登录页
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      error.message = errorMessage;
    } else if (error.request) {
      // 请求已发出但没有收到响应
      error.message = '网络连接失败，请检查网络';
    } else {
      // 请求配置出错
      error.message = '请求配置错误';
    }
    
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    // 这里可以根据后端返回的数据结构进行调整
    if (response.data.code === 200) {
      return response;
    }
    // 处理业务错误
    const error = new Error(data.message || '请求失败') as AxiosError;
    error.response = response;
    return Promise.reject(error);
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const errorMessage = errorMessages[status] || '请求失败';
      
      // 如果是401错误，清除token并跳转到登录页
      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      error.message = errorMessage;
    } else if (error.request) {
      // 请求已发出但没有收到响应
      error.message = '网络连接失败，请检查网络';
    } else {
      // 请求配置出错
      error.message = '请求配置错误';
    }
    
    return Promise.reject(error);
  }
);

export default request; 