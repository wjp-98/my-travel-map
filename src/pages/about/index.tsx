import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Layout 
      title="关于我们 - 我的旅行地图"
      description="了解我们的旅行地图项目"
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-4">关于我们</h1>
            <div className="w-24 h-1 bg-indigo-500 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">我们的使命</h2>
              <p className="text-gray-600 leading-relaxed">
                我的旅行地图是一个帮助旅行者记录和分享旅行足迹的平台。我们致力于为旅行爱好者提供一个分享和交流的空间，让每一次旅行都变得更加有意义。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">我们能为您提供</h2>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  记录您的旅行足迹
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  分享旅行故事
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  发现新的旅行目的地
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  与其他旅行者交流
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 italic">
              "让每一次旅行都成为难忘的回忆，让每一个故事都值得被分享"
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 