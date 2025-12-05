import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6 }
};

const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.5 }
};

const TravelForm = dynamic(() => import('@/components/TravelForm'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

export default function CreateTravel() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key="create-travel"
          className="min-h-screen relative overflow-hidden"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          {/* 背景装饰元素 */}
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* 背景图片 */}
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
              alt="旅行背景"
              fill
              className="object-cover"
              priority
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </motion.div>

          <div className="relative z-10">
            <div className="max-w-4xl mx-auto p-6">
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center mb-8"
              >
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  创建你的旅行故事
                </motion.h1>
                <motion.p 
                  className="text-xl text-indigo-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  记录美好瞬间，分享旅行经验
                </motion.p>
              </motion.div>

              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ delay: 0.6 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8"
              >
                <TravelForm />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
} 