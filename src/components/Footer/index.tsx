import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-8">
          {/* 关于我们 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">关于我们</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              我的旅行地图是一个记录和分享旅行经历的平台，让每一次旅行都成为难忘的回忆。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4 ml-12">
            <h3 className="text-lg font-semibold text-gray-900">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/earth" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                  地球
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                  旅行足迹
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                  旅行相册
                </Link>
              </li>
              <li>
                <Link href="/share" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                  旅行分享
                </Link>
              </li>
            </ul>
          </div>

          {/* 帮助中心 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">帮助中心</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                  使用指南
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 订阅 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">订阅更新</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              订阅我们的新闻通讯，获取最新的旅行资讯和更新。
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                订阅
              </button>
            </form>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-6 h-6">
                <Image
                  src="/images/logo.jpg"
                  alt="旅行地图logo"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <span className="text-gray-500 text-sm">© 2024 我的旅行地图. All rights reserved.</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-indigo-500 text-sm transition-colors duration-200">
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 