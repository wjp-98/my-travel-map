import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const LoginCard = dynamic(() => import('@/components/LoginCard'), {
  loading: () => (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative ml-[calc(66%-150px)] p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded mt-6"></div>
        </div>
      </div>
    </div>
  ),
});

export default function Login() {
  return (
    <Layout>
      <div className="min-h-screen relative">
        {/* 背景图片 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
            alt="旅行背景"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* 返回首页按钮 */}
        <Link 
          href="/"
          className="absolute top-4 left-4 z-20 flex items-center text-white hover:text-indigo-200 transition-colors duration-200"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>返回首页</span>
        </Link>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          {/* 左侧广告位 */}
          <div className="absolute left-[calc(17%-150px)] top-1/2 -translate-y-1/2 w-[44%] h-[60%]">
            <Image
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
              alt="广告位"
              fill
              className="object-cover rounded-2xl"
              priority
            />
            <div className="absolute inset-0 bg-black/30 rounded-2xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-16"
          >
            <LoginCard />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 