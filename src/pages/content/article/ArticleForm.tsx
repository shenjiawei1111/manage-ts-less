import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Card, Typography, Space, message } from 'antd';
import type { Rule } from 'antd/es/form';
import ModuleRichtext from '@/pages/module/ModuleRichtext';

// 使用Ant Design的RuleObject类型，而不是自定义接口

const { Title } = Typography;
const { Option } = Select;

interface ArticleData {
  title: string;
  author: string;
  content: string;
}

const ArticleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<ArticleData>();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 模拟从API获取文章数据
  useEffect(() => {
    if (id && id !== 'new') {
      setIsEditing(true);
      // 模拟获取文章数据
      const mockArticleData = {
        title: `模拟标题${id}`,
        author: '随机作者',
        content: `模拟内容${id}`
      };
      form.setFieldsValue(mockArticleData);
    }
  }, [id, form]);

  // 标题验证
  const validateTitle = (_: Rule, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入标题!'));
    }
    const hasNumber = /\d/.test(value);
    if (hasNumber) {
      return Promise.reject(new Error('标题不能含有数字信息!'));
    }
    return Promise.resolve();
  };

  // 处理提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        // 模拟提交数据
        console.log('提交文章数据:', values);
        message.success(isEditing ? '文章更新成功!' : '文章创建成功!');
        
        // 直接导航到文章管理页面
        navigate('/settings/article');
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 处理返回 - 直接导航到文章管理页面
  const handleBack = () => {
    navigate('/settings/article');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>{isEditing ? '编辑文章' : '新增文章'}</Title>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: '',
            author: '',
            content: ''
          }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ validator: validateTitle }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="作者"
            name="author"
            rules={[{ required: true, message: '请选择作者' }]}
          >
            <Select placeholder="请选择">
              <Option value="">请选择</Option>
              <Option value="作者1">作者1</Option>
              <Option value="作者2">作者2</Option>
              <Option value="作者3">作者3</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="就餐数据"
          >
            <Input addonAfter="单位" placeholder="请输入" />
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
          >
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '8px' }}>
              <ModuleRichtext />
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={handleBack}>返回</Button>
              <Button type="primary" onClick={handleSubmit}>
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ArticleForm;