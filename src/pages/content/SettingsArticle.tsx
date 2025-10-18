import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Table, Space, Tag, Modal, Card, Typography, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

interface Article {
  id: string;
  title: string;
  author: string;
  createTime: string;
  status: string;
}

const SettingsArticle: React.FC = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([
    { id: '1', title: 'JavaScript 基础教程', author: '张三', createTime: '2024-01-15', status: '已发布' },
    { id: '2', title: 'React Hooks 详解', author: '李四', createTime: '2024-01-14', status: '已发布' },
    { id: '3', title: 'CSS Grid 布局实战', author: '王五', createTime: '2024-01-13', status: '草稿' },
    { id: '4', title: 'TypeScript 类型系统', author: '赵六', createTime: '2024-01-12', status: '已发布' },
    { id: '5', title: 'Vue 3 Composition API', author: '孙七', createTime: '2024-01-11', status: '草稿' },
  ]);
  const navigate = useNavigate();

  // 处理搜索
  const handleSearch = (value: string) => {
    setIsSearching(true);
    // 模拟搜索过程
    setTimeout(() => {
      setIsSearching(false);
      // 实际项目中这里会根据搜索词过滤数据
      console.log('搜索关键词:', value);
    }, 1000);
  };

  // 处理刷新
  const handleRefresh = () => {
    setIsSearching(true);
    // 模拟刷新过程
    setTimeout(() => {
      setIsSearching(false);
      message.success('数据刷新成功');
    }, 1000);
  };

  // 处理新增
  const handleAdd = () => {
    navigate('/settings/article/new');
  };

  // 处理编辑
  const handleEdit = (id: string) => {
    navigate(`/settings/article/${id}`);
  };

  // 打开删除确认对话框
  const handleDeleteClick = (id: string) => {
    setCurrentDeleteId(id);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    setArticles(prev => prev.filter(article => article.id !== currentDeleteId));
    setDeleteModalVisible(false);
    message.success('文章删除成功');
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  // 定义列配置类型
  interface ColumnConfig {
    title: string;
    dataIndex?: string;
    key: string;
    width?: string;
    render?: (text: string, record: Article, index: number) => React.ReactNode;
  }

  // 表格列配置
  const columns: ColumnConfig[] = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '已发布' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: string, record: Article) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteClick(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 删除确认对话框
  const deleteConfirmModal = () => (
    <Modal
      title="确认删除"
      open={deleteModalVisible}
      onOk={handleConfirmDelete}
      onCancel={handleCancelDelete}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ danger: true }}
    >
      <p>确定要删除这篇文章吗？</p>
    </Modal>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>文章管理</Title>
        </div>
        
        {/* 搜索和操作区域 */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="请输入关键词搜索"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            loading={isSearching}
            style={{ width: 320 }}
          />
          
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={isSearching}
            >
              刷新
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增
            </Button>
          </Space>
        </div>
        
        {/* 表格数据展示 */}
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={isSearching}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: '暂无数据',
          }}
        />
      </Card>
      
      {/* 删除确认对话框 */}
      {deleteConfirmModal()}
    </div>
  );
};

export default SettingsArticle;