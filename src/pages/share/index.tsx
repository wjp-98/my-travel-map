import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { getTravelDetailList } from '@/api/article';
import type { TravelDetail } from '@/api/article';
import dayjs from 'dayjs';
import { HeartOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';

// 模拟分享数据
// const mockShares = [
//   {
//     id: 1,
//     title: '巴黎浪漫之旅',
//     content: '在埃菲尔铁塔下见证爱情，在塞纳河畔漫步，在卢浮宫感受艺术...',
//     author: {
//       name: '旅行达人',
//       avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
//     },
//     images: [
//       'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
//       'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=800&q=80'
//     ],
//     location: '法国巴黎',
//     date: '2024-03-15',
//     likes: 128,
//     comments: 32
//   },
//   {
//     id: 2,
//     title: '京都古韵',
//     content: '漫步在古老的街道，感受传统与现代的完美融合...',
//     author: {
//       name: '文化探索者',
//       avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
//     },
//     images: [
//       'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
//       'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
//     ],
//     location: '日本京都',
//     date: '2024-03-10',
//     likes: 95,
//     comments: 18
//   },
//   {
//     id: 3,
//     title: '巴塞罗那的阳光',
//     content: '高迪的建筑艺术，地中海的阳光，还有美味的西班牙美食...',
//     author: {
//       name: '美食爱好者',
//       avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80'
//     },
//     images: [
//       'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
//       'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
//     ],
//     location: '西班牙巴塞罗那',
//     date: '2024-03-05',
//     likes: 156,
//     comments: 45
//   }
// ];

export default function SharePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('latest');
  const [shares, setShares] = useState<TravelDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handleViewDetails = (id: string) => {
    router.push(`/article/${id}`);
  };

  const queryTravelDetailList = async (page: number) => {
    try {
      setLoading(true);
      const { data } = await getTravelDetailList(page, 10, 'createdAt', 'desc');
      if (page === 1) {
        setShares(data.data.list);
      } else {
        setShares(prev => [...prev, ...data.data.list]);
      }
      setTotal(data.data.pagination.total);
      setAllLoaded(data.data.list.length < 10 || shares.length + data.data.list.length >= data.data.pagination.total);
      setCurrentPage(data.data.pagination.page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const loadMoreShares = () => {
    if (loading || allLoaded) return;
    queryTravelDetailList(currentPage + 1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMoreShares();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, loading, allLoaded]);

  useEffect(() => {
    queryTravelDetailList(1);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* 主要内容 - 朋友圈样式 */}
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* 标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">旅行分享</h1>
            <p className="text-gray-500 mt-1">发现世界的精彩</p>
          </div>

          {/* 分享列表 - 朋友圈样式 */}
          <div className="space-y-4">
            {shares.map((share) => (
              <motion.div
                key={share.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(share.id)}
              >
                {/* 作者信息 */}
                <div className="p-4 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={share.author.avatar || '/images/default-avatar.jpg'}
                        alt={share.author.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{share.author.username}</p>
                      <p className="text-xs text-gray-500">{dayjs(share.createdAt).format('MM月DD日 HH:mm')}</p>
                    </div>
                    <div className="text-xs text-gray-400">{share.location?.city || share.cityName}</div>
                  </div>
                </div>

                {/* 文字内容 */}
                {share.description && (
                  <div className="px-4 pb-3">
                    <p className="text-gray-800 leading-relaxed line-clamp-3">{share.description}</p>
                  </div>
                )}

                {/* 图片展示 - 类似朋友圈 */}
                {share.images && share.images.length > 0 && (
                  <div 
                    className={`px-4 pb-3 ${
                      share.images.length === 1 
                        ? '' 
                        : share.images.length === 4
                        ? 'grid grid-cols-2 gap-1'
                        : share.images.length <= 3
                        ? 'grid grid-cols-3 gap-1'
                        : 'grid grid-cols-3 gap-1'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {share.images.slice(0, 9).map((img, index) => (
                      <div
                        key={index}
                        className={`relative ${
                          share.images.length === 1
                            ? 'w-full h-96'
                            : share.images.length === 4 && index === 0
                            ? 'col-span-2 row-span-2 h-48'
                            : 'aspect-square'
                        } overflow-hidden rounded`}
                      >
                        <Image
                          src={img.url || img}
                          alt={`${share.title} - 图片 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {share.images.length > 9 && index === 8 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">+{share.images.length - 9}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 封面图（如果没有图片列表） */}
                {(!share.images || share.images.length === 0) && share.coverImage && (
                  <div className="px-4 pb-3">
                    <div className="relative w-full h-64 overflow-hidden rounded">
                      <Image
                        src={share.coverImage}
                        alt={share.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* 互动区域 */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <HeartOutlined className="text-lg" />
                      <span className="text-sm">{share.stats?.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageOutlined className="text-lg" />
                      <span className="text-sm">{share.stats?.comments || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <EyeOutlined className="text-lg" />
                      <span className="text-sm">{share.stats?.views || 0}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {share.cityName}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 加载更多 */}
          {!allLoaded && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMoreShares}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                disabled={loading}
              >
                {loading ? '加载中...' : '加载更多'}
              </button>
            </div>
          )}

          {allLoaded && shares.length > 0 && (
            <div className="mt-6 text-center text-gray-400 text-sm">
              没有更多内容了
            </div>
          )}

          {shares.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              暂无分享内容
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 