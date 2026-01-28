import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getBaseURL } from '@/config/api';

// 创建axios实例
const request = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // 允许携带 cookie
});

// 是否正在刷新 token
let isRefreshing = false;
// 待重试的请求队列
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    // 从localStorage获取accessToken
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 如果请求头中没有 X-Refresh-Token，且存在 refreshToken，则通过 cookie 或 header 传递
    // 注意：如果后端支持 cookie 自动传递，则不需要手动添加
    // 如果需要通过 header 传递，可以在这里添加：
    // if (refreshToken && !config.headers['X-Refresh-Token']) {
    //   config.headers['X-Refresh-Token'] = refreshToken;
    // }

    return config;
  },
  (error: AxiosError) => {
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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response) {
      const status = error.response.status;
      const errorMessage = errorMessages[status] || '请求失败';

      // 如果是401错误，尝试刷新 token
      if (status === 401 && originalRequest && !originalRequest._retry) {
        // 如果正在刷新，将请求加入队列
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return request(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshTokenValue = localStorage.getItem('refreshToken');

        if (!refreshTokenValue) {
          // 没有 refreshToken，清除所有认证信息并跳转登录
          processQueue(new Error('No refresh token'), null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          // 调用刷新 token 接口
          const refreshResponse = await axios.post(
            `${getBaseURL()}/auth/refresh-token`,
            {},
            {
              headers: {
                'X-Refresh-Token': refreshTokenValue,
              },
              // withCredentials: true,
            }
          );

          if (refreshResponse.data.success && refreshResponse.data.data) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

            // 更新 localStorage
            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // 更新过期时间（60分钟）
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + 60);
            localStorage.setItem('tokenExpiry', expiryDate.toISOString());

            // 更新请求头
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            // 处理队列中的请求
            processQueue(null, newAccessToken);
            isRefreshing = false;

            // 重试原始请求
            return request(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          // 刷新失败，清除所有认证信息并跳转登录
          processQueue(refreshError, null);
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
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