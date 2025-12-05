import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState, useEffect } from 'react';
import { getTravelPhotos } from '@/api/travel';
import dayjs from 'dayjs';
// 模拟相册数据
const galleryData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    title: '巴黎铁塔',
    location: '巴黎',
    date: '2024-03-15'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1526493692374-0f7e0e8a4e3d',
    title: '塞纳河畔',
    location: '巴黎',
    date: '2024-03-15'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4',
    title: '卢浮宫',
    location: '巴黎',
    date: '2024-03-15'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f',
    title: '香榭丽舍大街',
    location: '巴黎',
    date: '2024-03-15'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e',
    title: '蒙马特高地',
    location: '巴黎',
    date: '2024-03-15'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    title: '金阁寺',
    location: '京都',
    date: '2024-03-10'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9',
    title: '清水寺',
    location: '京都',
    date: '2024-03-10'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1529927066848-95b525b0ea0e',
    title: '圣家堂',
    location: '巴塞罗那',
    date: '2024-03-05'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    title: '米拉之家',
    location: '巴塞罗那',
    date: '2024-03-05'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1582972236019-e3d10d132b95',
    title: '兰布拉大道',
    location: '巴塞罗那',
    date: '2024-03-05'
  }
];

export default function Gallery() {
  const [columns, setColumns] = useState<number[][]>([[], [], []]);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPhotos = async (page: number) => {
    try {
      setLoadingMore(true);
      const res = await getTravelPhotos(page);
      const { list, pagination } = res.data.data;
      
      if (page === 1) {
        setPhotos(list);
      } else {
        setPhotos(prev => [...prev, ...list]);
      }

      // 检查是否已加载全部
      if (photos.length + list.length >= pagination.total) {
        setAllLoaded(true);
      }

      setCurrentPage(page);
    } catch (error) {
      console.error('加载照片失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // 计算每列的高度并分配图片
    const distributeImages = () => {
      const newColumns: number[][] = [[], [], []];
      const columnHeights = [0, 0, 0];
      photos.forEach((item) => {
        // 找到最短的列
        const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
        newColumns[shortestColumn].push(item.id);
        // 更新列高度（这里假设所有图片高度相同，实际应用中需要根据图片实际高度计算）
        columnHeights[shortestColumn] += 1;
      });
      setColumns(newColumns);
    };

    distributeImages();
  }, [photos]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        if (!loadingMore && !allLoaded) {
          loadPhotos(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, loadingMore, allLoaded]);

  useEffect(() => {
    loadPhotos(1);
  }, []);

  return (
    <Layout 
      title="相册 - 我的旅行地图"
      description="我的旅行相册"
    >
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">旅行相册</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {columns.map((column, columnIndex) => (
                  <div key={columnIndex} className="space-y-4">
                    {column.map((photoId) => {
                    console.log(photoId)
                      const photo = photos.find(p => p.id === photoId);
                      console.log(photo)
                      if (!photo) return null;
                      
                      return (
                        <motion.div
                          key={photo.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-square group"
                        >
                          <LazyLoadImage
                            src={photo.imageUrl}
                            alt={photo.title}
                            effect="blur"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h3 className="text-lg font-semibold">{photo.title}</h3>
                              <p className="text-sm">{photo.cityName}</p>
                              <p className="text-sm">{dayjs(photo.date).format('YYYY-MM-DD')}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {loadingMore && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              )}

              {allLoaded && photos.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  已加载全部图片
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
} 