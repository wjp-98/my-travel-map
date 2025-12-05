// API 配置
export const API_CONFIG = {
  // 开发环境
  development: {
    baseURL: 'http://localhost:5000/api',
  },
  // 生产环境
  production: {
    baseURL: 'http://47.122.158.109:5000/api',
  },
};

// 根据环境获取基础 URL
export const getBaseURL = () => {
  const env = process.env.NODE_ENV;
  console.log('env', env);
  return API_CONFIG[env as keyof typeof API_CONFIG].baseURL;
}; 