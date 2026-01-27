import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { login as onLogin, register as onRegisterApi } from '@/api/auth';
import type { LoginResponse, RegisterResponse } from '@/api/auth';
import type { AxiosResponse } from 'axios';
import dayjs from 'dayjs';

const { Item } = Form;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function LoginCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (values: any) => {
    if (!verificationSuccess) {
      message.error('请先完成验证');
      return;
    }

    try {
      const response = await onLogin(values);
      const { success, data, code } = response.data;
      if (!success) {
        // message.error(data);
        form.setFields([{ name: 'password', errors: [data as unknown as string] }]);
        return;
      }
      login(data.user, data.accessToken, data.refreshToken);
      router.push('/');
    } catch (error) {
      message.error('登录失败，请重试');
    }
  };

  const handleRegister = async (values: any) => {
    if (!verificationSuccess) {
      message.error('请先完成验证');
      return;
    }

    try {
    const response = await onRegisterApi({
        username: values.username,
        password: values.password,
        phone: values.phone,
        email: values.email,
        birthday: {
          year: dayjs(values.birthday).year(),
          month: dayjs(values.birthday).month() + 1,
          day: dayjs(values.birthday).date()
        }
      });

      if (!response.data.success) {
        form.setFields([{ name: 'username', errors: [response.data.message] }]);
        return;
      }
      if (response.data.success && typeof response.data === 'object') {
         login(response.data.data.user, response.data.data.accessToken, response.data.data.refreshToken);
         router.push('/');
      }

    } catch (error) {
      message.error('注册失败，请重试');
    }
  };


  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);
  const maxPositionRef = useRef(0);

  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container || verificationSuccess) return;
    
    // 获取初始位置
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const containerRect = container.getBoundingClientRect();
    maxPositionRef.current = containerRect.width - 40; // 40 is slider width
    
    // 计算当前滑块位置
    const currentTransform = slider.style.transform;
    const currentPosition = currentTransform ? parseFloat(currentTransform.match(/translateX\(([^)]+)\)/)?.[1] || '0') : 0;
    
    startXRef.current = clientX;
    startPositionRef.current = currentPosition;
    
    // 立即设置拖动状态
    isDraggingRef.current = true;
    setIsVerifying(true);
    
    // 移除过渡效果以确保拖动流畅，并优化性能
    slider.style.transition = 'none';
    slider.style.willChange = 'transform';
  };

  const handleSliderEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (!verificationSuccess && sliderRef.current) {
      // 添加过渡效果用于回弹
      const slider = sliderRef.current;
      slider.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      slider.style.transform = 'translateX(0)';
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = '';
          sliderRef.current.style.willChange = '';
        }
      }, 300);
    } else if (sliderRef.current) {
      // 拖动成功时也清理 willChange
      sliderRef.current.style.willChange = '';
    }
    setIsVerifying(false);
  }, [verificationSuccess]);

  // 添加全局事件监听器 - 始终监听，但只在拖动时响应
  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      // 计算新位置：基于初始位置 + 鼠标移动距离
      const deltaX = e.clientX - startXRef.current;
      let position = startPositionRef.current + deltaX;
      const maxPosition = maxPositionRef.current;
      
      // 限制在有效范围内
      position = Math.max(0, Math.min(position, maxPosition));

      // 直接更新，实时跟随
      slider.style.transform = `translateX(${position}px)`;

      // 检查终点
      if (position >= maxPosition - 2) {
        setVerificationSuccess(true);
        setIsVerifying(false);
        isDraggingRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length === 0) return;
      
      // 计算新位置
      const deltaX = e.touches[0].clientX - startXRef.current;
      let position = startPositionRef.current + deltaX;
      const maxPosition = maxPositionRef.current;
      
      // 限制在有效范围内
      position = Math.max(0, Math.min(position, maxPosition));

      // 直接更新
      slider.style.transform = `translateX(${position}px)`;

      // 检查终点
      if (position >= maxPosition - 2) {
        setVerificationSuccess(true);
        setIsVerifying(false);
        isDraggingRef.current = false;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        handleSliderEnd();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDraggingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        handleSliderEnd();
      }
    };

    // 处理鼠标离开窗口的情况
    const handleMouseLeave = (e: MouseEvent) => {
      if (isDraggingRef.current && e.relatedTarget === null) {
        handleSliderEnd();
      }
    };

    // 始终添加事件监听器，确保即使鼠标移出也能跟踪
    document.addEventListener('mousemove', handleMouseMove, { capture: true, passive: false });
    document.addEventListener('mouseup', handleMouseUp, { capture: true, passive: false });
    document.addEventListener('mouseleave', handleMouseLeave, { capture: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    document.addEventListener('touchend', handleTouchEnd, { capture: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('touchmove', handleTouchMove, true);
      document.removeEventListener('touchend', handleTouchEnd, true);
    };
  }, [handleSliderEnd]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden relative ml-[calc(66%-150px)]"
    >
      {/* 卡片背景图 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
          alt="卡片背景"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      {/* 顶部标题 */}
      <div className="p-6 bg-gradient-to-r from-indigo-500/90 to-purple-500/90 relative z-10">
        <h1 className="text-3xl font-bold text-white text-center">
          {isLogin ? '欢迎回来' : '加入我们'}
        </h1>
      </div>

      {/* 表单区域 */}
      <div className="p-8 relative z-10">
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            type={isLogin ? 'primary' : 'default'}
            onClick={() => {
              setIsLogin(true);
              form.resetFields();
            }}
            className={`
              px-6 py-2 rounded-full transition-all duration-300
              ${isLogin
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-indigo-500/50'
                : 'bg-white/50 text-gray-600 hover:text-indigo-600 hover:bg-white/80'
              }
            `}
            icon={
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            }
          >
            登录
          </Button>
          <Button
            type={!isLogin ? 'primary' : 'default'}
            onClick={() => {
              setIsLogin(false);
              form.resetFields();
            }}
            className={`
              px-6 py-2 rounded-full transition-all duration-300
              ${!isLogin
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-indigo-500/50'
                : 'bg-white/50 text-gray-600 hover:text-indigo-600 hover:bg-white/80'
              }
            `}
            icon={
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
          >
            注册
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Form
              form={form}
              onFinish={isLogin ? handleLogin : handleRegister}
              layout="vertical"
              className="space-y-4"
            >
              <Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Item>

              <Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password
                  placeholder="请输入密码"
                  iconRender={(visible: boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Item>

              {!isLogin && (
                <>
                  <Item
                    name="confirmPassword"
                    label="确认密码"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: '请确认密码' },
                      ({ getFieldValue }: { getFieldValue: (name: string) => any }) => ({
                        validator(_: any, value: string) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="请再次输入密码"
                      iconRender={(visible:boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Item>

                  <Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input placeholder="请输入邮箱" />
                  </Item>

                  <Item
                    name="phone"
                    label="手机号"
                    rules={[
                      { required: true, message: '请输入手机号' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                    ]}
                  >
                    <Input placeholder="请输入手机号" />
                  </Item>

                  <Item
                    name="birthday"
                    label="生日"
                    rules={[{ required: true, message: '请选择生日' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="YYYY-MM-DD"
                      placeholder="请选择生日"
                    />
                  </Item>
                </>
              )}

              {/* 滑块验证 */}
              <div className="mt-6">
                <div 
                  ref={containerRef} 
                  className="relative h-10 bg-gray-100 rounded-full"
                  style={{ touchAction: 'none' }}
                >
                  <div
                    ref={sliderRef}
                    className={`absolute left-0 top-0 h-10 w-10 z-10 bg-indigo-600 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center ${verificationSuccess ? 'bg-green-500' : ''
                      }`}
                    onMouseDown={handleSliderStart}
                    onTouchStart={handleSliderStart}
                    style={{ touchAction: 'none', userSelect: 'none', willChange: 'transform', pointerEvents: 'auto' }}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <div 
                    className={`absolute inset-0 flex items-center justify-center text-sm text-gray-500 ${verificationSuccess ? 'text-green-500' : 'text-gray-500'}`}
                    style={{ pointerEvents: 'none' }}
                  >
                    {verificationSuccess
                      ? '验证成功'
                      : '请按住滑块，拖动到最右边'}
                  </div>
                </div>
              </div>

              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
                  size="large"
                >
                  {isLogin ? '登录' : '注册'}
                </Button>
              </Item>
            </Form>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 