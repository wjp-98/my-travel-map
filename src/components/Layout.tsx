import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const router = useRouter();
  const { user } = useAuth();
  const showHeader = !router.pathname.includes('/login');
  const isHome = router.pathname === '/';
  
  // 需要隐藏创建按钮的路由
  const hideCreateButton = [
    '/login',
    '/create-travel'
  ].includes(router.pathname);

  return (
    <div className="min-h-screen">
      {showHeader && <Header />}
      <main>{children}</main>
      {isHome && <Footer />}
      
      {/* 创建按钮 */}
      {user && !hideCreateButton && (
        <Link href="/create-travel">
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </motion.div>
        </Link>
      )}
    </div>
  );
} 