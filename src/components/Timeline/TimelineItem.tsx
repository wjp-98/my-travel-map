import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from "dayjs"

interface TimelineItemProps {
  date: string;
  location: string;
  image: string;
  description: string;
  index: number;
  id:string;
}

export default function TimelineItem({ date, location, image, description, index,id }: TimelineItemProps) {
  const isEven = index % 2 === 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  
  const handleCardClick = () => {
    router.push(`/article/${id}`);
  };

  return (
    <div className="relative flex items-center justify-center mb-16">
      {/* 左侧内容 */}
      <div className="w-1/2 pr-8">
        {isEven ? (
          // 左侧卡片
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="text-right"
          >
            <div 
              className="p-4 rounded-lg shadow-lg bg-white inline-block transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={handleCardClick}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{location}</h3>
              <LazyLoadImage
                alt={location}
                src={image}
                effect="blur"
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>
          </motion.div>
        ) : (
          // 左侧时间
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="text-right"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300 inline-block"
            >
              {dayjs(date).format('YYYY-MM-DD')}
            </button>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-white p-4 rounded-lg shadow-lg w-48 inline-block"
              >
                <p className="text-sm text-gray-600">{date}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* 中间的时间轴点 */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-6 bg-indigo-500 rounded-full border-4 border-white"></div>
      </div>

      {/* 右侧内容 */}
      <div className="w-1/2 pl-8">
        {!isEven ? (
          // 右侧卡片
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="text-left"
          >
            <div 
              className="p-4 rounded-lg shadow-lg bg-white inline-block transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={handleCardClick}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{location}</h3>
              <LazyLoadImage
                alt={location}
                src={image}
                effect="blur"
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>
          </motion.div>
        ) : (
          // 右侧时间
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="text-left"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300 inline-block"
            >
              {dayjs(date).format('YYYY-MM-DD')}
            </button>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-white p-4 rounded-lg shadow-lg w-48 inline-block"
              >
                <p className="text-sm text-gray-600">{date}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 