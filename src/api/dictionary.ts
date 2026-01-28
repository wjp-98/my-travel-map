import request from '@/utils/request';

// 字典类型
export interface DictionaryType {
  id: string;
  code: string;
  name: string;
  description?: string;
  sort: number;
}

// 字典项
export interface Dictionary {
  id: string;
  typeCode: string;
  label: string;
  value: string;
  description?: string;
  sort: number;
  extra?: Record<string, any>;
}

// 获取所有字典类型
export const getDictionaryTypes = () => {
  return request.get<{
    code: number;
    success: boolean;
    data: DictionaryType[];
  }>('/dictionary/types');
};

// 根据类型代码获取字典项列表
export const getDictionariesByType = (typeCode: string) => {
  return request.get<{
    code: number;
    success: boolean;
    data: Dictionary[];
  }>(`/dictionary/${typeCode}`);
};

// 批量获取多个类型的字典项
export const getDictionariesBatch = (typeCodes: string[]) => {
  return request.post<{
    code: number;
    success: boolean;
    data: Record<string, Dictionary[]>;
  }>('/dictionary/batch', { typeCodes });
};

// 创建字典类型（需要管理员权限）
export const createDictionaryType = (data: { code: string; name: string; description?: string; sort?: number }) => {
  return request.post<{
    code: number;
    success: boolean;
    data: DictionaryType;
  }>('/dictionary/types', data);
};

// 创建字典项（需要管理员权限）
export const createDictionary = (data: {
  typeCode: string;
  label: string;
  value: string;
  description?: string;
  sort?: number;
  extra?: Record<string, any>;
}) => {
  return request.post<{
    code: number;
    success: boolean;
    data: Dictionary;
  }>('/dictionary', data);
};

// 更新字典类型
export const updateDictionaryType = (id: string, data: Partial<DictionaryType>) => {
  return request.put<{
    code: number;
    success: boolean;
    data: DictionaryType;
  }>(`/dictionary/types/${id}`, data);
};

// 更新字典项
export const updateDictionary = (id: string, data: Partial<Dictionary>) => {
  return request.put<{
    code: number;
    success: boolean;
    data: Dictionary;
  }>(`/dictionary/${id}`, data);
};

// 删除字典类型
export const deleteDictionaryType = (id: string) => {
  return request.delete<{
    code: number;
    success: boolean;
    message: string;
  }>(`/dictionary/types/${id}`);
};

// 删除字典项
export const deleteDictionary = (id: string) => {
  return request.delete<{
    code: number;
    success: boolean;
    message: string;
  }>(`/dictionary/${id}`);
};
