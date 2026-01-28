import request from '@/utils/request';

// 旅游地详情接口响应
export interface TravelDetailResponse {
  code: number;
  success: boolean;
  message: string;
  data: TravelDetail;
}

// 旅游地详情数据
export interface TravelDetail {
  id: string;
  cityName: string;
  title: string;
  coverImage: string; // 封面图
  images: ImageItem[]; // 图片列表
  description: string; // 简介
  content: ContentBlock[]; // 内容块（文字+图片）
  author: Author; // 作者信息
  stats: Stats; // 统计数据
  tags: string[]; // 标签
  location: Location; // 位置信息
  travelInfo: TravelInfo; // 旅行信息
  tips: Tip[]; // 旅行小贴士
  relatedPlaces: RelatedPlace[]; // 相关地点
  comments: Comment[]; // 评论
  createdAt: string;
  updatedAt: string;
  isLiked: boolean; // 是否已点赞
  isCollected: boolean; // 是否已收藏
}

// 图片项
export interface ImageItem {
  id: string;
  url: string;
  thumbnail?: string; // 缩略图
  description?: string; // 图片描述
  width?: number;
  height?: number;
}

// 内容块
export interface ContentBlock {
  type: 'text' | 'image' | 'video' | 'location';
  content: string;
  image?: ImageItem;
  style?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
}

// 作者信息
export interface Author {
  id: string;
  username: string;
  avatar: string;
  nickname?: string;
  bio?: string;
  isFollowed?: boolean; // 是否已关注
}

// 统计数据
export interface Stats {
  views: number; // 浏览量
  likes: number; // 点赞数
  collects: number; // 收藏数
  comments: number; // 评论数
  shares: number; // 分享数
}

// 位置信息
export interface Location {
  name: string; // 地点名称
  address: string; // 详细地址
  coordinates?: {
    lat: number;
    lng: number;
  };
  city: string;
  country: string;
  region?: string; // 地区/省份
}

// 旅行信息
export interface TravelInfo {
  bestTime: string[]; // 最佳旅行时间
  duration: string; // 建议游玩时长
  budget: {
    min: number; // 最低预算
    max: number; // 最高预算
    currency: string; // 货币单位
  };
  transportation: string[]; // 交通方式
  accommodation: Accommodation[]; // 住宿推荐
  food: Food[]; // 美食推荐
  attractions: Attraction[]; // 景点推荐
}

// 住宿推荐
export interface Accommodation {
  name: string;
  type: string; // 类型：酒店/民宿/青旅等
  price: {
    min: number;
    max: number;
    currency: string;
  };
  rating?: number; // 评分
  address: string;
  image?: string;
}

// 美食推荐
export interface Food {
  name: string;
  description: string;
  price?: {
    min: number;
    max: number;
    currency: string;
  };
  address: string;
  image?: string;
  rating?: number;
}

// 景点推荐
export interface Attraction {
  name: string;
  description: string;
  image?: string;
  address: string;
  ticketPrice?: {
    adult: number;
    child?: number;
    currency: string;
  };
  openingHours?: string;
  rating?: number;
}

// 旅行小贴士
export interface Tip {
  title: string;
  content: string;
  icon?: string;
  category: 'safety' | 'money' | 'culture' | 'transport' | 'other';
}

// 相关地点
export interface RelatedPlace {
  id: string;
  name: string;
  image: string;
  distance?: string; // 距离
  description?: string;
}

// 评论
export interface Comment {
  id: string;
  author: Author;
  content: string;
  images?: string[];
  likes: number;
  replies?: Comment[]; // 回复
  createdAt: string;
  isLiked?: boolean;
}

// 获取旅游地详情
export const getTravelDetail = (id: string) => {
  return request.get<TravelDetailResponse>(`/travel/detail/${id}`);
};

// 获取旅游地详情（通过城市名）
export const getTravelDetailByCity = (cityName: string) => {
  return request.get<TravelDetailResponse>(`/travel/detail/city/${cityName}`);
};

// 获取旅游地详情列表（用于分享页面）
export const getTravelDetailList = (page: number = 1, pageSize: number = 10, sortBy: string = 'createdAt', order: string = 'desc') => {
  return request.get<{
    code: number;
    success: boolean;
    data: {
      list: TravelDetail[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    };
  }>(`/travel/list?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&order=${order}`);
};

// 创建旅游地详情
export const createTravelDetail = (data: Partial<TravelDetail>) => {
  return request.post<TravelDetailResponse>('/travel/', data);
};

// 获取旅行路线列表（用于地球页面）
export const getTravelRoutes = () => {
  return request.get<{
    code: number;
    success: boolean;
    data: Array<{
      id: string;
      departure: {
        city: string;
        coordinates: { lat: number; lng: number };
      };
      destination: {
        city: string;
        coordinates: { lat: number; lng: number };
      };
      transportMode: string;
      cityName: string;
      title: string;
    }>;
  }>('/travel/routes');
};

// 点赞/取消点赞
export const toggleLike = (id: string) => {
  return request.post<{ success: boolean; isLiked: boolean; likes: number }>(`/travel/${id}/like`);
};

// 收藏/取消收藏
export const toggleCollect = (id: string) => {
  return request.post<{ success: boolean; isCollected: boolean; collects: number }>(`/travel/${id}/collect`);
};

// 添加评论
export const addComment = (id: string, data: { content: string; images?: string[] }) => {
  return request.post<{ success: boolean; comment: Comment }>(`/travel/${id}/comment`, data);
};

// 获取评论列表
export const getComments = (id: string, page: number = 1, pageSize: number = 10) => {
  return request.get<{
    code: number;
    success: boolean;
    data: {
      list: Comment[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
      };
    };
  }>(`/travel/${id}/comments?page=${page}&pageSize=${pageSize}`);
};

// 关注/取消关注作者
export const toggleFollow = (authorId: string) => {
  return request.post<{ success: boolean; isFollowed: boolean }>(`/users/${authorId}/follow`);
};
