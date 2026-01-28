import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import TravelDetailComponent from '@/components/TravelDetail';

export default function Article() {
  const router = useRouter();
  const { city } = router.query;
  // 支持通过 id 或 cityName 访问
  const idOrCityName = city as string;

  if (!idOrCityName) {
    return (
      <Layout title="文章未找到 - 我的旅行地图" description="文章未找到">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="旅行详情 - 我的旅行地图"
      description="旅行详情"
    >
      <TravelDetailComponent idOrCityName={idOrCityName} />
    </Layout>
  );
} 