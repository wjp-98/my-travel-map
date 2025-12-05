import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState, useEffect } from 'react';
import Script from 'next/script';

// 添加微信小程序类型定义
declare global {
  interface Window {
    wx?: {
      miniProgram: {
        postMessage: (data: {
          data: {
            title: string;
            desc: string;
            link: string;
            imgUrl: string;
          }
        }) => void;
      };
    };
  }
}

// 模拟文章数据
const articles = {
  '巴黎': {
    title: '浪漫之都 - 巴黎',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      'https://images.unsplash.com/photo-1526493692374-0f7e0e8a4e3d',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4',
      'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f',
      'https://images.unsplash.com/photo-1543349689-9a4d426bee8e'
    ],
    content: [
      '巴黎，这座浪漫之都，以其独特的艺术氛围和历史文化吸引着世界各地的游客。',
      '漫步在塞纳河畔，感受着这座城市的历史沉淀。埃菲尔铁塔在夕阳下熠熠生辉，卢浮宫的艺术珍品让人叹为观止。',
      '在蒙马特高地，艺术家们用画笔记录着这座城市的美丽。香榭丽舍大街的繁华，圣母院的庄严，都让人流连忘返。',
      '巴黎的美食同样令人难忘，从街角的咖啡馆到米其林餐厅，每一口都是对味蕾的极致享受。',
      '巴黎的夜生活同样精彩，塞纳河游船、蒙马特高地的酒吧、香榭丽舍大街的剧院，每一处都散发着独特的魅力。'
    ]
  },
  '京都': {
    title: '古都京都',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9'
    ],
    content: [
      '京都，这座千年古都，完美地融合了传统与现代。',
      '春天的京都，樱花盛开，古老的寺庙在粉色的花海中若隐若现。金阁寺的金碧辉煌，清水寺的悬空舞台，都让人感受到日本传统文化的魅力。',
      '漫步在祗园的小巷中，偶遇身着和服的艺伎，仿佛穿越回了江户时代。岚山的竹林小径，让人感受到大自然的宁静。',
      '京都的抹茶和怀石料理，更是让人体验到日本饮食文化的精髓。'
    ]
  },
  '巴塞罗那': {
    title: '艺术之城 - 巴塞罗那',
    images: [
      'https://images.unsplash.com/photo-1529927066848-95b525b0ea0e',
      'https://images.unsplash.com/photo-1583422409516-2895a77efded',
      'https://images.unsplash.com/photo-1582972236019-e3d10d132b95'
    ],
    content: [
      '巴塞罗那，这座充满艺术气息的城市，是高迪的杰作。',
      '圣家堂的彩色玻璃窗，在阳光下折射出梦幻般的光芒。米拉之家的波浪形外观，展现了高迪对自然的独特理解。',
      '兰布拉大道的街头艺人，为这座城市增添了活力。哥特区的中世纪建筑，诉说着这座城市的历史。',
      '巴塞罗那的海鲜饭和桑格利亚酒，让人感受到地中海的热情。'
    ]
  },
  '纽约': {
    title: '不夜城 - 纽约',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
      'https://images.unsplash.com/photo-1496442226666-8d4d24e4d1f4',
      'https://images.unsplash.com/photo-1496442226666-8d4d24e4d1f4'
    ],
    content: [
      '纽约，这座不夜城，是梦想与现实的交汇点。',
      '时代广场的霓虹灯，照亮了每一个追梦者的脸庞。中央公园的绿意，为这座钢筋水泥的森林带来一丝宁静。',
      '自由女神像守护着这座城市的自由精神，帝国大厦见证着这座城市的辉煌。',
      '纽约的多元文化，体现在每一个街角，每一家餐厅，每一场演出中。'
    ]
  }
};

export default function Article() {
  const router = useRouter();
  const { city } = router.query;
  const article = city ? articles[city as keyof typeof articles] : null;
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleShare = () => {

  };

  if (!article) {
    return (
      <Layout title="文章未找到 - 我的旅行地图" description="文章未找到">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <p className="text-gray-600">文章未找到</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`${article.title} - 我的旅行地图`}
      description={`${article.title}的旅行记录`}
    >
      {/* 添加微信 SDK */}
      <Script
        src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* 装饰性背景元素 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 relative">
          {/* 标题区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span>旅行日记</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </motion.div>

          {/* 内容区域 */}
          <div className="space-y-8">
            {article.content.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* 文字内容 */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm mb-6">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                </div>

                {/* 图片展示 */}
                {index < article.images.length && (
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <LazyLoadImage
                      alt={`${article.title} - 图片 ${index + 1}`}
                      src={article.images[index]}
                      effect="blur"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* 底部导航 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 py-4">
            <div className="max-w-2xl mx-auto px-4 flex justify-between items-center">
              <button 
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 