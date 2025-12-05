'use client';

import { useState } from 'react';
import { Form, Input, Button, DatePicker, message, Upload, Tabs, Switch } from 'antd';
import { motion } from 'framer-motion';
import { useOSSUpload } from '@/hooks/useOSSUpload';
import { UploadOutlined, PlusOutlined, ShareAltOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { addTravelRecord } from '@/api/travel';
import type { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';

interface TravelFormValues {
  title: string;
  city: string;
  date: [Dayjs, Dayjs];
  cityImage: string;
  article: string;
  photos: string[];
  description: string;
  isShared: boolean;
}

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function TravelForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('travel');
  const { uploadFile, loading: uploading, progress } = useOSSUpload();
  const [cityImageUrl, setCityImageUrl] = useState<string>('');
  const [travelPhotos, setTravelPhotos] = useState<string[]>([]);
  const [cityImageUploading, setCityImageUploading] = useState(false);
  const [travelPhotosUploading, setTravelPhotosUploading] = useState(false);

  const handleCityImageUpload = async (file: File) => {
    try {
      setCityImageUploading(true);
      const url = await uploadFile(file);
      console.log('url', url);
      setCityImageUrl(url);
      return false;
    } catch (error) {
      message.error('城市图片上传失败');
      return false;
    } finally {
      setCityImageUploading(false);
    }
  };

  const handleTravelPhotosUpload = async (file: File) => {
    try {
      setTravelPhotosUploading(true);
      const url = await uploadFile(file);
      setTravelPhotos(prev => [...prev, url]);
      return false;
    } catch (error) {
      message.error('旅行照片上传失败');
      return false;
    } finally {
      setTravelPhotosUploading(false);
    }
  };

  const onFinish = async (values: TravelFormValues) => {
    try {
      const formData = {
        ...values,
        startTime: values.date[0],
        endTime: values.date[1],
        cityName: values.city,
        cityImage: cityImageUrl,
        photos: travelPhotos,
      };
      const res = await addTravelRecord(formData);
      console.log(res);
      if (res.data.code === 200) {
        message.success('提交成功！');
        router.push('/share');
      } else {
        message.error('提交失败，请重试');
      }
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={staggerContainer}
      className="max-w-2xl mx-auto"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="mb-8"
        items={[
          {
            key: 'travel',
            label: '旅行记录',
            children: (
              <motion.div variants={fadeIn}>
                <Form
                  form={form}
                  onFinish={onFinish}
                  layout="vertical"
                  className="space-y-6"
                >
                  <Form.Item
                    name="title"
                    label="标题"
                    rules={[{ required: true, message: '请输入标题' }]}
                  >
                    <Input 
                      placeholder="给你的旅行记录起个名字" 
                      className="h-12 text-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="city"
                    label="城市"
                    rules={[{ required: true, message: '请输入城市名称' }]}
                  >
                    <Input 
                      placeholder="你去过哪个城市？" 
                      className="h-12 text-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="date"
                    label="旅行时间"
                    rules={[{ required: true, message: '请选择旅行时间' }]}
                  >
                    <RangePicker 
                      className="w-full h-12"
                      locale={locale}
                    />
                  </Form.Item>

                  <Form.Item
                    label="城市图片"
                    required
                  >
                    <Upload
                      accept="image/*"
                      beforeUpload={handleCityImageUpload}
                      showUploadList={false}
                    >
                      <Button 
                        icon={<UploadOutlined />}
                        className="h-12 w-full"
                        loading={cityImageUploading}
                      >
                        {cityImageUploading ? `上传中 ${progress}%` : '上传城市图片'}
                      </Button>
                    </Upload>
                    {cityImageUrl && (
                      <div className="mt-2">
                        <img 
                          src={cityImageUrl} 
                          alt="城市图片" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </Form.Item>

                  <Form.Item
                    label="旅行照片"
                  >
                    <Upload
                      accept="image/*"
                      beforeUpload={handleTravelPhotosUpload}
                      showUploadList={false}
                      disabled={travelPhotos.length >= 9}
                    >
                      <Button 
                        icon={<PlusOutlined />}
                        className="h-12 w-full"
                        loading={travelPhotosUploading}
                        disabled={travelPhotos.length >= 9}
                      >
                        {travelPhotosUploading ? `上传中 ${progress}%` : travelPhotos.length >= 9 ? '最多只能上传9张照片' : '上传旅行照片'}
                      </Button>
                    </Upload>
                    <div className="text-sm text-gray-500 mt-1">
                      最多可上传9张照片
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {travelPhotos.map((url, index) => (
                        <div key={index} className="relative aspect-square">
                          <img 
                            src={url} 
                            alt={`旅行照片 ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="旅行描述"
                    rules={[{ required: true, message: '请输入旅行描述' }]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="分享你的旅行故事..."
                      className="text-lg"
                    />
                  </Form.Item>

                  <Form.Item
                    name="isShared"
                    label="是否分享"
                    valuePropName="checked"
                    initialValue={true}
                    tooltip="选择分享会将记录分享到旅行分享"
                  >
                    <div className="flex items-center space-x-2">
                      <Switch 
                        defaultChecked
                        className="bg-gray-300"
                        checkedChildren={<ShareAltOutlined className="text-white" />}
                        unCheckedChildren={<ShareAltOutlined className="text-gray-500" />}
                      />
                      <span className="text-gray-600">分享到旅行分享</span>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      发布旅行记录
                    </Button>
                  </Form.Item>
                </Form>
              </motion.div>
            )
          },
          {
            key: 'guide',
            label: (
              <span className="text-gray-400 cursor-not-allowed">
                旅行攻略
                <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">开发中</span>
              </span>
            ),
            disabled: true,
            children: (
              <motion.div variants={fadeIn} className="text-center py-12 text-gray-400">
                旅行攻略功能正在开发中，敬请期待...
              </motion.div>
            )
          }
        ]}
      />
    </motion.div>
  );
} 