'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Upload, Steps, Select, InputNumber, Space, Rate } from 'antd';
import { motion } from 'framer-motion';
import { useOSSUpload } from '@/hooks/useOSSUpload';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import { createTravelDetail } from '@/api/article';
import { useRouter } from 'next/router';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

interface TravelDetailFormValues {
  // 基本信息（必填）
  cityName: string;
  title: string;
  coverImage: string;
  description: string;
  tags: string[];
  travelTime: string;
  overallRating: number;
  
  // 其他照片（最多9张，不需要描述）
  images: string[];
  
  // 景点评价
  attractions: Array<{
    name: string;
    visitTime: string;
    rating: number;
    comment?: string;
  }>;
  
  // 美食评价
  foodReviews: Array<{
    name: string;
    rating: number;
    comment?: string;
    image?: string;
  }>;
  
  // 酒店评价
  hotelReviews: Array<{
    name: string;
    rating: number;
    comment?: string;
    image?: string;
  }>;
  
  // 攻略PDF
  guidePdf: string;
}

export default function TravelDetailForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const { uploadFile, loading: uploading, progress } = useOSSUpload();
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [imageList, setImageList] = useState<string[]>([]);
  const [guidePdfUrl, setGuidePdfUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    {
      title: '基本信息',
      content: 'BasicInfo',
    },
    {
      title: '其他照片',
      content: 'Images',
    },
    {
      title: '景点评价',
      content: 'Attractions',
    },
    {
      title: '美食评价',
      content: 'Food',
    },
    {
      title: '酒店评价',
      content: 'Hotels',
    },
    {
      title: '攻略上传',
      content: 'Guide',
    },
  ];

  const handleCoverImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      setCoverImageUrl(url);
      form.setFieldsValue({ coverImage: url });
      return false;
    } catch (error) {
      message.error('封面上传失败');
      return false;
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (imageList.length >= 9) {
        message.warning('最多只能上传9张照片');
        return false;
      }
      const url = await uploadFile(file);
      setImageList([...imageList, url]);
      return false;
    } catch (error) {
      message.error('图片上传失败');
      return false;
    }
  };

  const handlePdfUpload = async (file: File) => {
    // 检查文件类型
    if (file.type !== 'application/pdf') {
      message.error('只能上传PDF文件');
      return false;
    }
    try {
      const url = await uploadFile(file);
      setGuidePdfUrl(url);
      form.setFieldsValue({ guidePdf: url });
      return false;
    } catch (error) {
      message.error('PDF上传失败');
      return false;
    }
  };

  const next = () => {
    // 第一步需要验证必填项
    if (currentStep === 0) {
      form.validateFields(['cityName', 'title', 'coverImage', 'description', 'travelTime', 'overallRating']).then(() => {
        setCurrentStep(currentStep + 1);
      }).catch(() => {
        message.warning('请完成必填项');
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values: TravelDetailFormValues) => {
    try {
      setSubmitting(true);
      
      // 构建提交数据
      const submitData = {
        cityName: values.cityName,
        title: values.title,
        coverImage: coverImageUrl,
        description: values.description,
        tags: values.tags || [],
        travelTime: values.travelTime,
        overallRating: values.overallRating,
        images: imageList,
        attractions: values.attractions || [],
        foodReviews: values.foodReviews || [],
        hotelReviews: values.hotelReviews || [],
        guidePdf: guidePdfUrl || ''
      };

      const res = await createTravelDetail(submitData);
      
      if (res.data.code === 201 || res.data.success) {
        message.success('创建成功！');
        router.push('/share');
      } else {
        message.error(res.data.message || '创建失败，请重试');
      }
    } catch (error: any) {
      console.error('创建失败:', error);
      message.error(error.response?.data?.message || '创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <Form.Item
              name="cityName"
              label="城市名称"
              rules={[{ required: true, message: '请输入城市名称' }]}
            >
              <Input placeholder="例如：北京" className="h-12" />
            </Form.Item>

            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="给你的旅行地起个吸引人的标题" className="h-12" />
            </Form.Item>

            <Form.Item
              label="封面图片"
              required
            >
              <Upload
                accept="image/*"
                beforeUpload={handleCoverImageUpload}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} loading={uploading} className="h-12 w-full">
                  {uploading ? `上传中 ${progress}%` : coverImageUrl ? '重新上传封面' : '上传封面图片'}
                </Button>
              </Upload>
              {coverImageUrl && (
                <div className="mt-2">
                  <img src={coverImageUrl} alt="封面" className="w-full h-48 object-cover rounded-lg" />
                </div>
              )}
            </Form.Item>

            <Form.Item
              name="description"
              label="简介"
              rules={[{ required: true, message: '请输入简介' }]}
            >
              <TextArea rows={6} placeholder="简要介绍这个旅行地的特色..." />
            </Form.Item>

            <Form.Item
              name="tags"
              label="标签"
              rules={[{ required: true, message: '请至少添加一个标签' }]}
            >
              <Select
                mode="tags"
                placeholder="输入标签后按回车添加"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="travelTime"
              label="旅行时间"
              rules={[{ required: true, message: '请输入旅行时间' }]}
            >
              <Input placeholder="例如：2024年3月" className="h-12" />
            </Form.Item>

            <Form.Item
              name="overallRating"
              label="总评价"
              rules={[{ required: true, message: '请给出总评价' }]}
            >
              <Rate allowHalf />
            </Form.Item>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-sm text-gray-500 mb-4">
              可以上传最多9张照片，不需要描述
            </div>
            
            <Upload
              accept="image/*"
              beforeUpload={handleImageUpload}
              showUploadList={false}
              disabled={imageList.length >= 9}
            >
              <Button 
                icon={<UploadOutlined />} 
                className="w-full h-12"
                disabled={imageList.length >= 9}
              >
                {imageList.length >= 9 ? '已达到最大数量（9张）' : `上传照片（${imageList.length}/9）`}
              </Button>
            </Upload>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {imageList.map((url, index) => (
                <div key={index} className="relative aspect-square group">
                  <img 
                    src={url} 
                    alt={`照片 ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="primary"
                    danger
                    icon={<MinusCircleOutlined />}
                    size="small"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newList = imageList.filter((_, i) => i !== index);
                      setImageList(newList);
                    }}
                  >
                    删除
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Form.List name="attractions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">景点 {name + 1}</span>
                        <Button
                          type="link"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        >
                          删除
                        </Button>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="景点名称"
                        rules={[{ required: true, message: '请输入景点名称' }]}
                      >
                        <Input placeholder="例如：天安门广场" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'visitTime']}
                        label="游览时间"
                      >
                        <Input placeholder="例如：2小时" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'rating']}
                        label="评价"
                      >
                        <Rate allowHalf />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'comment']}
                        label="评价内容"
                      >
                        <TextArea rows={3} placeholder="写下你的评价..." />
                      </Form.Item>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                    className="w-full h-12"
                  >
                    添加景点
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Form.List name="foodReviews">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">美食 {name + 1}</span>
                        <Button
                          type="link"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        >
                          删除
                        </Button>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="美食名称"
                        rules={[{ required: true, message: '请输入美食名称' }]}
                      >
                        <Input placeholder="例如：北京烤鸭" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'rating']}
                        label="评价"
                      >
                        <Rate allowHalf />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'comment']}
                        label="评价内容"
                      >
                        <TextArea rows={3} placeholder="写下你的评价..." />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'image']}
                        label="美食图片（可选）"
                      >
                        <Upload
                          accept="image/*"
                          beforeUpload={async (file) => {
                            try {
                              const url = await uploadFile(file);
                              form.setFieldsValue({ foodReviews: form.getFieldValue('foodReviews').map((item: any, idx: number) => 
                                idx === name ? { ...item, image: url } : item
                              )});
                              return false;
                            } catch (error) {
                              message.error('图片上传失败');
                              return false;
                            }
                          }}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />}>上传图片</Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                    className="w-full h-12"
                  >
                    添加美食评价
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Form.List name="hotelReviews">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">酒店 {name + 1}</span>
                        <Button
                          type="link"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        >
                          删除
                        </Button>
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        label="酒店名称"
                        rules={[{ required: true, message: '请输入酒店名称' }]}
                      >
                        <Input placeholder="例如：北京饭店" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'rating']}
                        label="评价"
                      >
                        <Rate allowHalf />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'comment']}
                        label="评价内容"
                      >
                        <TextArea rows={3} placeholder="写下你的评价..." />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'image']}
                        label="酒店图片（可选）"
                      >
                        <Upload
                          accept="image/*"
                          beforeUpload={async (file) => {
                            try {
                              const url = await uploadFile(file);
                              form.setFieldsValue({ hotelReviews: form.getFieldValue('hotelReviews').map((item: any, idx: number) => 
                                idx === name ? { ...item, image: url } : item
                              )});
                              return false;
                            } catch (error) {
                              message.error('图片上传失败');
                              return false;
                            }
                          }}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />}>上传图片</Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                    className="w-full h-12"
                  >
                    添加酒店评价
                  </Button>
                </>
              )}
            </Form.List>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-sm text-gray-500 mb-4">
              可以上传PDF格式的旅行攻略
            </div>
            
            <Upload
              accept=".pdf"
              beforeUpload={handlePdfUpload}
              showUploadList={false}
            >
              <Button 
                icon={<FilePdfOutlined />} 
                className="w-full h-12"
                loading={uploading}
              >
                {uploading ? `上传中 ${progress}%` : guidePdfUrl ? '重新上传攻略' : '上传攻略PDF'}
              </Button>
            </Upload>
            
            {guidePdfUrl && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-2">
                  <FilePdfOutlined className="text-red-500 text-2xl" />
                  <div>
                    <p className="font-medium">攻略已上传</p>
                    <a href={guidePdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                      查看PDF
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="max-w-3xl mx-auto"
      initialValues={{
        overallRating: 0,
        attractions: [],
        foodReviews: [],
        hotelReviews: []
      }}
    >
      <Steps current={currentStep} items={steps} className="mb-8" />

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="min-h-[400px]"
      >
        {renderStepContent()}
      </motion.div>

      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <Button onClick={prev} size="large">
            上一步
          </Button>
        )}
        <div className="flex-1" />
        {currentStep < steps.length - 1 ? (
          <Button type="primary" onClick={next} size="large">
            下一步
          </Button>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={submitting}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            提交
          </Button>
        )}
      </div>
    </Form>
  );
}
