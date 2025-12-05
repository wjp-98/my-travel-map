import dynamic from 'next/dynamic';
import Layout from '@/components/Layout';

// 动态导入Earth组件
const Earth = dynamic(() => import('../../components/Earth'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100 min-h-[500px]">
      <div className="text-lg text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        正在加载3D地球...
      </div>
    </div>
  ),
});

export default function EarthPage() {
  return (
    <Layout>
      <div className="w-full px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">欢迎来到我的旅行地图</h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          在这里，记录了我走过的城市，看见的风景。
        </p>
        <Earth />
      </div>
    </Layout>
  );
} 