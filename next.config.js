/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    };
    
    // 添加对 Three.js 相关模块的处理
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  transpilePackages: [
    '@ant-design/icons',
    '@ant-design/icons-svg',
    'antd',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-input',
    '@rc-component/util',
    '@babel/runtime',
    'lodash-es',
    '@react-three/fiber',
    '@react-three/drei',
    'three',
    'postprocessing'
  ],
  compiler: {
    emotion: true
  }
};