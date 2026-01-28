import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  HeartOutlined, 
  HeartFilled, 
  StarOutlined, 
  StarFilled,
  ShareAltOutlined,
  MessageOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  CarOutlined,
  HomeOutlined,
  FireOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Button, Tag, Avatar, Spin, message } from 'antd';
import { useRouter } from 'next/router';
import { 
  getTravelDetail,
  getTravelDetailByCity, 
  toggleLike, 
  toggleCollect,
  type TravelDetail 
} from '@/api/article';
import { useAuth } from '@/context/AuthContext';

interface TravelDetailProps {
  idOrCityName: string;
}

export default function TravelDetailComponent({ idOrCityName }: TravelDetailProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TravelDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    loadDetail();
  }, [idOrCityName]);

  // 判断是否为有效的 MongoDB ObjectId (24位十六进制字符串)
  const isValidObjectId = (str: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(str);
  };

  const loadDetail = async () => {
    try {
      setLoading(true);
      let response;
      
      // 判断是 id 还是 cityName
      if (isValidObjectId(idOrCityName)) {
        // 是 id，通过 id 获取
        response = await getTravelDetail(idOrCityName);
      } else {
        // 是 cityName，通过城市名获取
        response = await getTravelDetailByCity(idOrCityName);
      }
      
      if (response.data.success) {
        setDetail(response.data.data);
      } else {
        message.error('加载失败，请重试');
      }
    } catch (error) {
      console.error('加载详情失败:', error);
      message.error('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      message.info('请先登录');
      router.push('/login');
      return;
    }
    if (!detail) return;
    
    try {
      const response = await toggleLike(detail.id);
      if (response.data.success) {
        setDetail({
          ...detail,
          isLiked: response.data.isLiked,
          stats: {
            ...detail.stats,
            likes: response.data.likes
          }
        });
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCollect = async () => {
    if (!isAuthenticated) {
      message.info('请先登录');
      router.push('/login');
      return;
    }
    if (!detail) return;
    
    try {
      const response = await toggleCollect(detail.id);
      if (response.data.success) {
        setDetail({
          ...detail,
          isCollected: response.data.isCollected,
          stats: {
            ...detail.stats,
            collects: response.data.collects
          }
        });
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: detail?.title,
        text: detail?.description,
        url: window.location.href,
      });
    } else {
      // 复制链接
      navigator.clipboard.writeText(window.location.href);
      message.success('链接已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spin size="large" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">内容不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部图片轮播 */}
      <div className="relative w-full h-[60vh] bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={detail.images[currentImageIndex]?.url || detail.coverImage}
              alt={detail.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* 图片指示器 */}
        {detail.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {detail.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <LeftOutlined />
        </button>

        {/* 操作按钮 */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <ShareAltOutlined />
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 作者信息 */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar src={detail.author.avatar} size={40} />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{detail.author.nickname || detail.author.username}</div>
            {detail.author.bio && (
              <div className="text-xs text-gray-500">{detail.author.bio}</div>
            )}
          </div>
          {detail.author.isFollowed !== undefined && (
            <Button
              type={detail.author.isFollowed ? 'default' : 'primary'}
              size="small"
              className="rounded-full"
            >
              {detail.author.isFollowed ? '已关注' : '关注'}
            </Button>
          )}
        </div>

        {/* 标题和标签 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{detail.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {detail.tags.map((tag, index) => (
            <Tag key={index} color="pink" className="rounded-full px-3 py-1">
              {tag}
            </Tag>
          ))}
        </div>

        {/* 统计数据 */}
        <div className="flex items-center space-x-6 mb-6 text-gray-600 text-sm">
          <div className="flex items-center space-x-1">
            <EyeOutlined />
            <span>{detail.stats.views}</span>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors ${
              detail.isLiked ? 'text-red-500' : ''
            }`}
          >
            {detail.isLiked ? <HeartFilled /> : <HeartOutlined />}
            <span>{detail.stats.likes}</span>
          </button>
          <button
            onClick={handleCollect}
            className={`flex items-center space-x-1 transition-colors ${
              detail.isCollected ? 'text-yellow-500' : ''
            }`}
          >
            {detail.isCollected ? <StarFilled /> : <StarOutlined />}
            <span>{detail.stats.collects}</span>
          </button>
          <div className="flex items-center space-x-1">
            <MessageOutlined />
            <span>{detail.stats.comments}</span>
          </div>
        </div>

        {/* 位置信息 */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <EnvironmentOutlined className="text-red-500 text-xl mt-1" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">{detail.location.name}</div>
              <div className="text-sm text-gray-600">{detail.location.address}</div>
              <div className="text-xs text-gray-500 mt-1">
                {detail.location.city} · {detail.location.country}
              </div>
            </div>
          </div>
        </div>

        {/* 旅行信息卡片 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4">
            <CalendarOutlined className="text-pink-500 text-xl mb-2" />
            <div className="text-xs text-gray-600 mb-1">最佳时间</div>
            <div className="text-sm font-semibold text-gray-900">
              {detail.travelInfo.bestTime.join('、')}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
            <DollarOutlined className="text-blue-500 text-xl mb-2" />
            <div className="text-xs text-gray-600 mb-1">预算</div>
            <div className="text-sm font-semibold text-gray-900">
              {detail.travelInfo.budget.min}-{detail.travelInfo.budget.max} {detail.travelInfo.budget.currency}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
            <CarOutlined className="text-green-500 text-xl mb-2" />
            <div className="text-xs text-gray-600 mb-1">交通</div>
            <div className="text-sm font-semibold text-gray-900">
              {detail.travelInfo.transportation.join('、')}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4">
            <HomeOutlined className="text-purple-500 text-xl mb-2" />
            <div className="text-xs text-gray-600 mb-1">游玩时长</div>
            <div className="text-sm font-semibold text-gray-900">
              {detail.travelInfo.duration}
            </div>
          </div>
        </div>

        {/* 内容正文 */}
        <div className="mb-6">
          <div className="text-gray-900 leading-relaxed mb-4 text-base">
            {detail.description}
          </div>
          
          {detail.content.map((block, index) => (
            <div key={index} className="mb-6">
              {block.type === 'text' && (
                <p 
                  className="text-gray-900 leading-relaxed text-base mb-4"
                  style={block.style}
                >
                  {block.content}
                </p>
              )}
              {block.type === 'image' && block.image && (
                <div 
                  className="relative w-full rounded-2xl overflow-hidden mb-4 cursor-pointer"
                  onClick={() => {
                    setModalImageIndex(detail.images.findIndex(img => img.id === block.image?.id) || 0);
                    setShowImageModal(true);
                  }}
                >
                  <Image
                    src={block.image.url}
                    alt={block.image.description || ''}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                  {block.image.description && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white text-sm">
                      {block.image.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 住宿推荐 */}
        {detail.travelInfo.accommodation.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <HomeOutlined className="mr-2 text-pink-500" />
              住宿推荐
            </h2>
            <div className="space-y-3">
              {detail.travelInfo.accommodation.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex space-x-4">
                    {item.image && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{item.type}</div>
                      <div className="text-sm text-gray-700 mb-1">{item.address}</div>
                      <div className="text-sm font-semibold text-pink-500">
                        {item.price.min}-{item.price.max} {item.price.currency}/晚
                      </div>
                      {item.rating && (
                        <div className="text-xs text-gray-500 mt-1">⭐ {item.rating}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 美食推荐 */}
        {detail.travelInfo.food.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FireOutlined className="mr-2 text-orange-500" />
              美食推荐
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {detail.travelInfo.food.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden">
                  {item.image && (
                    <div className="relative w-full h-32">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="font-semibold text-gray-900 text-sm mb-1">{item.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                    {item.price && (
                      <div className="text-xs text-pink-500 mt-1">
                        {item.price.min}-{item.price.max} {item.price.currency}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 景点推荐 */}
        {detail.travelInfo.attractions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <EnvironmentOutlined className="mr-2 text-blue-500" />
              必游景点
            </h2>
            <div className="space-y-3">
              {detail.travelInfo.attractions.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden">
                  <div className="flex space-x-4 p-4">
                    {item.image && (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                      <div className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</div>
                      <div className="text-xs text-gray-500 mb-2">{item.address}</div>
                      {item.ticketPrice && (
                        <div className="text-sm text-blue-500">
                          门票：{item.ticketPrice.adult} {item.ticketPrice.currency}
                        </div>
                      )}
                      {item.rating && (
                        <div className="text-xs text-gray-500 mt-1">⭐ {item.rating}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 旅行小贴士 */}
        {detail.tips.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <InfoCircleOutlined className="mr-2 text-green-500" />
              旅行小贴士
            </h2>
            <div className="space-y-3">
              {detail.tips.map((tip, index) => {
                const iconMap = {
                  safety: <SafetyOutlined className="text-red-500" />,
                  money: <DollarOutlined className="text-green-500" />,
                  culture: <InfoCircleOutlined className="text-blue-500" />,
                  transport: <CarOutlined className="text-purple-500" />,
                  other: <InfoCircleOutlined className="text-gray-500" />
                };
                return (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border-l-4 border-pink-500">
                    <div className="flex items-start space-x-3">
                      <div className="text-xl">{iconMap[tip.category]}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{tip.title}</div>
                        <div className="text-sm text-gray-600">{tip.content}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 相关地点 */}
        {detail.relatedPlaces.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">相关推荐</h2>
            <div className="grid grid-cols-2 gap-3">
              {detail.relatedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-gray-50 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/article/${place.name}`)}
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-gray-900 text-sm mb-1">{place.name}</div>
                    {place.distance && (
                      <div className="text-xs text-gray-500">距离 {place.distance}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex flex-col items-center space-y-1 ${
                  detail.isLiked ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                {detail.isLiked ? <HeartFilled className="text-xl" /> : <HeartOutlined className="text-xl" />}
                <span className="text-xs">{detail.stats.likes}</span>
              </button>
              <button
                onClick={handleCollect}
                className={`flex flex-col items-center space-y-1 ${
                  detail.isCollected ? 'text-yellow-500' : 'text-gray-600'
                }`}
              >
                {detail.isCollected ? <StarFilled className="text-xl" /> : <StarOutlined className="text-xl" />}
                <span className="text-xs">{detail.stats.collects}</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600">
                <MessageOutlined className="text-xl" />
                <span className="text-xs">{detail.stats.comments}</span>
              </button>
            </div>
            <Button
              type="primary"
              className="rounded-full px-8"
              onClick={handleShare}
            >
              分享
            </Button>
          </div>
        </div>

        {/* 图片查看模态框 */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 flex items-center justify-center"
              onClick={() => setShowImageModal(false)}
            >
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10"
              >
                <CloseOutlined />
              </button>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={detail.images[modalImageIndex]?.url || detail.coverImage}
                  alt=""
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                />
                {detail.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalImageIndex((modalImageIndex - 1 + detail.images.length) % detail.images.length);
                      }}
                      className="absolute left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                    >
                      <LeftOutlined />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalImageIndex((modalImageIndex + 1) % detail.images.length);
                      }}
                      className="absolute right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                    >
                      <RightOutlined />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部留白，避免被操作栏遮挡 */}
      <div className="h-20" />
    </div>
  );
}
