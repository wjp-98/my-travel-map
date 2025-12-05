import request from '@/utils/request';
import type { Dayjs } from 'dayjs';

// 获取所有旅行记录
export const getTravelRecords = () => {
    return request.get('/travel/records');
};

export interface TravelRecord {
    _id: string;
    title: string;
    travelMap: {
        _id: string;
        cityName: string;
    };
    startTime: string;
    endTime: string;
    description: string;
    cityImage: string;
    isShared: boolean;
    createdBy: {
        _id: string;
        username: string;
        id: string;
        avatar: string;
    };
    createdAt: string;
    __v: number;
}

export interface TravelRecordResponse {
    code: number;
    message: string;
    data: {
        list: TravelRecord[];
        pagination: {
            total: number;
            page: number;
            pageSize: number;
        };
    };
}

interface AddTravelRecordRequest {
    title: string;
    cityName: string;
    startTime: Dayjs;
    endTime: Dayjs;
    description: string;
    cityImage: string;
    photos: string[];
    isShared: boolean;
}

interface addTravelRecordResponse{
    code:number;
    message:string;
    success:boolean;
}

// 添加旅行记录
export const addTravelRecord = (data: AddTravelRecordRequest) => {
    return request.post<addTravelRecordResponse>('/travel-record', data);
};

// 获取我的旅行记录
export const getTravelRecordById = (page: number) => {
    return request.get<{data:{
        list: TravelRecord[];
        pagination: {
            total: number;
            page: number;
            pageSize: number;
        };
    }}>(`/travel-record/getMyTravelRecord?page=${page}`);
};

// 获取最新旅行记录
export const getTravelRecordByNewTime = (page: number) => {
    return request.get<{data:{
        list: TravelRecord[];
        pagination: {
            total: number;
            page: number;
            pageSize: number;
        };
    }}>(`/travel-record/getNewTravelRecord?page=${page} `);
};

// 获取旅行相册
export const getTravelPhotos = (page: number) => {
    return request.get<{
        data: {
            list: {
                id: string;
                image: string;
                title: string;
                location: string;
                date: string;
            }[];
            pagination: {
                total: number;
                page: number;
                pageSize: number;
            };
        };
    }>(`/travel-album//my-photos?page=${page}&pageSize=6`);
};

// 新增接口定义
export interface TravelRecordTimeline {
    id: string; // 将 _id 转换为 id
    cityId: string; // 添加城市ID
    cityName: string;
    cityImage: string;
    description: string;
    title: string;
    startTime: string;
    endTime: string;
    duration: number; // 旅行天数
}

//获取我的旅行时间轴
export const getMyTimeline=()=>{
    return request.get<{data:TravelRecordTimeline[]}>('/travel-record/getMyTimeline')
}






