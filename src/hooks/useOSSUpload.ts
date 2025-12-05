import { useState } from 'react';
import OSS from 'ali-oss';

// OSS配置
const ossConfig: OSS.Options = {
  region: process.env.NEXT_PUBLIC_OSS_REGION || 'oss-cn-hangzhou',
  accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.NEXT_PUBLIC_OSS_BUCKET || '',
};

// 初始化OSS客户端
const client = new OSS(ossConfig);

interface UseOSSUploadResult {
  uploadFile: (file: File) => Promise<string>;
  loading: boolean;
  progress: number;
}

export const useOSSUpload = (): UseOSSUploadResult => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setLoading(true);
      setProgress(0);
      console.log(file);

      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('文件大小不能超过10MB');
      }

      // 生成唯一的文件名
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
      
      // 上传文件
      const result = await client.put(fileName, file, {
        headers: {
          'Content-Type': file.type,
          'Referer': 'http://192.168.0.107:3000' // 
        },
        // @ts-ignore - OSS类型定义中缺少progress属性
        progress: (p: number) => {
          setProgress(Math.floor(p * 100));
        },
        expires: 3600 // 过期时间（秒）
      });

      console.log(result);

      return result.url;
    } catch (error) {
      console.error('上传失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFile,
    loading,
    progress,
  };
}; 