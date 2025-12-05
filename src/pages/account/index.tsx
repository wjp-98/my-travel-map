import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Form, Input, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

export default function AccountPage() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      // TODO: 调用更新用户信息的 API
      message.success('个人信息更新成功');
      setEditing(false);
    } catch (error) {
      message.error('更新失败，请重试');
    }
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB！');
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setUploading(true);
        // TODO: 调用上传头像的 API
        // const formData = new FormData();
        // formData.append('avatar', file);
        // const response = await uploadAvatar(formData);
        // onSuccess(response);
        message.success('头像上传成功');
      } catch (error) {
        onError && onError(error as unknown as Error);
        message.error('上传失败，请重试');
      } finally {
        setUploading(false);
      }
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* 左侧广告位 */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">推荐目的地</h3>
                  <div className="space-y-4">
                    <div className="group cursor-pointer">
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-2">
                        <img
                          src="/images/destinations/kyoto.jpg"
                          alt="京都"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        京都
                      </h4>
                      <p className="text-xs text-gray-500">日本 · 关西</p>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-2">
                        <img
                          src="/images/destinations/paris.jpg"
                          alt="巴黎"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        巴黎
                      </h4>
                      <p className="text-xs text-gray-500">法国 · 法兰西岛</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧个人中心内容 */}
            <div className="flex-grow">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">个人中心</h1>
                    <p className="mt-2 text-gray-500">管理您的个人信息和账户设置</p>
                  </div>
                  <Button
                    type={editing ? 'default' : 'primary'}
                    onClick={() => setEditing(!editing)}
                    className="h-10 px-6"
                  >
                    {editing ? '取消编辑' : '编辑资料'}
                  </Button>
                </div>

                <div className="flex items-start space-x-12">
                  {/* 头像部分 */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src="/images/default-avatar.jpg"
                            alt="默认头像"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {editing && (
                        <Upload {...uploadProps}>
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                            <UploadOutlined className="text-white text-3xl" />
                          </div>
                        </Upload>
                      )}
                    </div>
                  </div>

                  {/* 表单部分 */}
                  <div className="flex-grow">
                    <Form
                      form={form}
                      layout="vertical"
                      initialValues={{
                        username: user?.username,
                        email: user?.email,
                        phone: user?.phone,
                      }}
                      onFinish={handleSubmit}
                      className="max-w-lg"
                    >
                      <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                      >
                        <Input
                          disabled={!editing}
                          className="h-11"
                          placeholder="请输入用户名"
                        />
                      </Form.Item>

                      <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                          { required: true, message: '请输入邮箱' },
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input
                          disabled={!editing}
                          className="h-11"
                          placeholder="请输入邮箱"
                        />
                      </Form.Item>

                      <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                          { required: true, message: '请输入手机号' },
                          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                        ]}
                      >
                        <Input
                          disabled={!editing}
                          className="h-11"
                          placeholder="请输入手机号"
                        />
                      </Form.Item>

                      {editing && (
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={uploading}
                            className="h-11 px-8"
                          >
                            保存修改
                          </Button>
                        </Form.Item>
                      )}
                    </Form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 