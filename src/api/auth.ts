import request from '@/utils/request';

// 用户登录接口
export interface LoginParams {
  username: string;
  password: string;
}

interface LoginSuccessResponse {
  user: {
    username: string;
    phone: string;
    email: string;
    birthday: {
      year: number;
      month: number;
      day: number;
    };
  };
  token: string;
}

export interface LoginResponse {
  code: number;
  success: boolean;
  data: LoginSuccessResponse;
  message: string;
}

export const login = (data: LoginParams) => {
  return request.post<LoginResponse>('/users/login', data);
};

// 用户注册接口
export interface RegisterParams {
  username: string;
  password: string;
  phone: string;
  email: string;
  birthday: {
    year: number;
    month: number;
    day: number;
  };
}

export interface RegisterResponse {
  code: number;
  success: boolean;
  data: {
    user: {
      username: string;
      phone: string;
      email: string;
      birthday: {
        year: number;
        month: number;
        day: number;
      };
    };
    token: string;
  };
  message: string;
}

export const register = (data: RegisterParams) => {
  return request.post<RegisterResponse>('/users/register', data);
};

// 获取用户信息
export interface UserInfo {
  id: string;
  username: string;
  name: string;
  avatar?: string;
}

export const getUserInfo = () => {
  return request.get<UserInfo>('/auth/user-info');
}; 