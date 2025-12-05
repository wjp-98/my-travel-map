import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState } from 'react';
// import { LeftOutlined } from '@ant-design/icons';

// 模拟数据
const mockTravelData = {
  id: '1',
  title: '浪漫巴黎之旅',
  description: '巴黎，这座浪漫之都，总是让人流连忘返。漫步在塞纳河畔，感受着这座城市的艺术气息。卢浮宫的艺术珍品，埃菲尔铁塔的壮丽景色，香榭丽舍大街的繁华，都让人难以忘怀。',
  images: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    'https://images.unsplash.com/photo-1526493692374-0f7e0e8a4e3d',
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4',
    'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f',
    'https://images.unsplash.com/photo-1543349689-9a4d426bee8e'
  ],
  author: {
    name: '旅行达人',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  },
  location: '巴黎, 法国',
  date: '2024-03-15',
  tags: ['欧洲', '艺术', '美食']
};

export default function TravelDetail() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleImageClick = (index: number) => {
    setCurrentImage(index);
    setShowImageModal(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* 顶部导航 */}
        <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4 z-10">
          <div className="max-w-2xl mx-auto px-4 flex items-center">
            <button 
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {/* <LeftOutlined className="text-xl" /> */}
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-4">旅行记录</h1>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="max-w-2xl mx-auto px-4 pt-20 pb-24">
          {/* 作者信息 */}
          <div className="flex items-center mb-6">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <LazyLoadImage
                src={mockTravelData.author.avatar}
                alt={mockTravelData.author.name}
                effect="blur"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-900">{mockTravelData.author.name}</div>
              <div className="text-sm text-gray-500">{mockTravelData.date}</div>
            </div>
          </div>

          {/* 标题 */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {mockTravelData.title}
          </motion.h1>

          {/* 位置和标签 */}
          <div className="flex items-center mb-6">
            <span className="text-gray-600">{mockTravelData.location}</span>
            <div className="ml-4 flex space-x-2">
              {mockTravelData.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 图片展示 */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {mockTravelData.images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square cursor-pointer"
                onClick={() => handleImageClick(index)}
              >
                <LazyLoadImage
                  src={image}
                  alt={`${mockTravelData.title} - 图片 ${index + 1}`}
                  effect="blur"
                  className="w-full h-full object-cover rounded-lg"
                />
                {index === 8 && mockTravelData.images.length > 9 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-xl font-bold">
                      +{mockTravelData.images.length - 9}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* 描述内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose max-w-none"
          >
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {mockTravelData.description}
            </p>
          </motion.div>
        </div>

        {/* 图片预览模态框 */}
        {showImageModal && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
              <button 
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
              <LazyLoadImage
                src={mockTravelData.images[currentImage]}
                alt={`${mockTravelData.title} - 图片 ${currentImage + 1}`}
                effect="blur"
                className="max-h-[90vh] max-w-full object-contain"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {mockTravelData.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImage ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImage(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 