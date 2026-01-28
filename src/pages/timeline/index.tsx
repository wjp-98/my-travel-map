import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import TimelineItem from '@/components/Timeline/TimelineItem';
import { motion } from 'framer-motion';
import { getMyTimeline } from '@/api/travel';
import type { TravelRecordTimeline } from '@/api/travel';

export default function Timeline() {
  const [timelineData, setTimelineData] = useState<TravelRecordTimeline[]>([]);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const response = await getMyTimeline();
        console.log(response.data)
        setTimelineData(response.data.data);
      } catch (error) {
        console.error('获取时间轴数据失败:', error);
      }
    };

    fetchTimelineData();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 pt-3 pb-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">我的旅行足迹</h1>
            <div className="w-20 h-1 bg-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm">记录每一段难忘的旅程</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* 统一的时间轴线条 */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-500 transform -translate-x-1/2"></div>

            {/* 时间轴内容 */}
            <div className="relative space-y-16 pb-[80px]">
              {timelineData.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  date={item.startTime}
                  location={item.cityName}
                  image={item.cityImage}
                  description={item.description}
                  index={index}
                  cityName={item.cityName}
                />
              ))}
            </div>

            {/* 开始出发文案 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-2">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-500 rounded-full mx-auto flex items-center justify-center relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500"></div>
                  <p className="text-sm text-white">开始出发</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 


