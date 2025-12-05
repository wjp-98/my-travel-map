import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';

// 动态导入 UserAvatar 组件
const UserAvatar = dynamic(() => import('@/components/UserAvatar'), {
  ssr: false,
  loading: () => (
    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
  ),
});

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-gradient-to-r from-indigo-50 to-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧 Logo 和网站名 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 relative transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/images/logo.jpg" 
                  alt="Logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                我的旅行地图
              </span>
            </Link>
          </div>

          {/* 右侧导航和用户信息 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/earth"
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/earth')
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  地球
                </Link>
                <Link
                  href="/timeline"
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/timeline')
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  时间轴
                </Link>
                <Link
                  href="/gallery"
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/gallery')
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  旅行相册
                </Link>
                <Link
                  href="/share"
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/share')
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  旅行分享
                </Link>
                <Link
                  href="/about"
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/about')
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  关于我们
                </Link>
                <UserAvatar />
              </>
            ) : (
              <>
                <Link
                  href="/share"
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/share')
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  旅行分享
                </Link>
                <Link
                  href="/about"
                  className={`text-sm font-medium px-2 py-2 rounded-md transition-colors duration-200 ${
                    isActive('/about')
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  关于我们
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                >
                  登录
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 