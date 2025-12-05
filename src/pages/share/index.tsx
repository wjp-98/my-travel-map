import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { getTravelRecordById, getTravelRecordByNewTime } from '@/api/travel';
import type { TravelRecord } from '@/api/travel';
import dayjs from 'dayjs';

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
  const [shares, setShares] = useState<TravelRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handleViewDetails = (id: string) => {
    router.push(`/travel/${id}`);
  };

  const queryMyTravelRecord = async (page: number) => {
    try {
      const { data } = await getTravelRecordById(page);
      if (page === 1) {
        setShares(data.data.list);
      } else {
        setShares(prev => [...prev, ...data.data.list]);
      }
      setTotal(data.data.pagination.total);
      setAllLoaded(shares.length + data.data.list.length >= data.data.pagination.total);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const queryNewTravelRecord = async (page: number) => {
    try {
      const { data } = await getTravelRecordByNewTime(page);
      console.log(data)
      if (page === 1) {
        setShares(data.data.list);
      } else {
        setShares(prev => [...prev, ...data.data.list]);
      }
      setTotal(data.data.pagination.total);
      setAllLoaded(shares.length + data.data.list.length >= data.data.pagination.total);
      setLoading(false);
      setCurrentPage(data.data.pagination.page);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const loadMoreShares = () => {
    if (loading || allLoaded) return;
    setLoading(true);
    if (activeTab === 'latest') {
      queryNewTravelRecord(currentPage + 1);
    } else {
      queryMyTravelRecord(currentPage + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        loadMoreShares();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, loading, allLoaded]);

  useEffect(() => {
    queryNewTravelRecord(1);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部横幅 */}
        <div className="relative h-64 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">旅行分享</h1>
              <p className="text-xl">分享您的旅行故事，发现世界的精彩</p>
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 标签页 */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4 bg-white rounded-lg shadow-sm p-2">
              <button
                onClick={() => {
                  setActiveTab('latest')
                  setShares([])
                  queryNewTravelRecord(1);
                }}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'latest'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                最新分享
              </button>
              <button
                onClick={() => {
                  setActiveTab('myShares')
                  setShares([]);
                  queryMyTravelRecord(1);
                }}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${activeTab === 'myShares'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                我的分享
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-md text-gray-400 cursor-not-allowed flex items-center"
              >
                热门分享
                <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">开发中</span>
              </button>
            </div>
          </div>

          {/* 分享卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shares.map((share) => (
              <motion.div
                key={share._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* 图片轮播 */}
                <div className="relative h-48">
                  <Image
                    src={share.cityImage}
                    alt={share.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 内容区域 */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={share.createdBy.avatar || '/images/default-avatar.jpg'}
                          alt={share.createdBy.username}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{share.createdBy.username}</p>
                        <p className="text-sm text-gray-500">{share.travelMap.cityName}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{dayjs(share.createdAt).format('YYYY-MM-DD')}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {share.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {share.description}
                  </p>

                  {/* 互动区域 */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-1 text-gray-400 cursor-not-allowed">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {/* <span>{share.likes}</span> */}
                      </button>
                      <button className="flex items-center space-x-1 text-gray-400 cursor-not-allowed">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {/* <span>{share.comments}</span> */}
                      </button>
                    </div>
                    <button
                      onClick={() => handleViewDetails(share._id)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 加载更多按钮 */}
          <div className="mt-12 text-center">
            <button
              onClick={loadMoreShares}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              disabled={loading || allLoaded}
            >
              {loading ? '加载中...' : allLoaded ? '没有更多记录了喔' : '加载更多'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 