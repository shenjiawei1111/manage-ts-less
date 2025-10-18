import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Modal, Form, 
  Checkbox, Space, Typography, Spin, message,
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import styles from './UserRole.module.less';

const { Title } = Typography;
const { Search } = Input;
const { Group: CheckboxGroup } = Checkbox;

// 角色数据类型定义
interface Role {
  id: string;
  name: string;
  description: string;
  createTime: string;
  updateTime: string;
  permissions: string[];
}

// 权限数据类型定义
interface Permission {
  key: string;
  title: string;
  children?: Permission[];
}

const UserRole: React.FC = () => {
  // 状态管理
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState<boolean>(false); // 新增全选状态
  const [form] = Form.useForm<Role>();
  
  // 权限数据 - 树形结构
  const permissions: Permission[] = [
    {
      key: 'dashboard',
      title: '仪表盘',
    },
    {
      key: 'component',
      title: '组件',
    },
    {
      key: 'system',
      title: '系统管理',
      children: [
        { key: 'system:user', title: '用户管理' },
        { key: 'system:role', title: '角色管理' },
      ],
    },
    {
      key: 'content',
      title: '内容管理',
      children: [
        { key: 'content:article', title: '文章管理' },
        { key: 'content:category', title: '分类管理' },
      ],
    },
    {
      key: 'external',
      title: '外部链接',
    },
  ];

  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 搜索过滤效果
  useEffect(() => {
    if (searchKeyword) {
      const filtered = roles.filter(role => 
        role.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        role.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(roles);
    }
  }, [searchKeyword, roles]);

  // 模拟加载数据
  const loadData = () => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 模拟数据 - 增加到10条
      const mockData: Role[] = [
        {
          id: '1',
          name: 'admin',
          description: '系统管理员',
          createTime: '2025-01-01 00:00:00',
          updateTime: '2025-08-20 20:49:45',
          permissions: ['dashboard', 'component', 'system', 'system:user', 'system:role', 'content', 'content:article', 'content:category', 'external']
        },
        {
          id: '2',
          name: 'editor',
          description: '内容编辑',
          createTime: '2025-02-15 10:30:00',
          updateTime: '2025-08-15 14:22:30',
          permissions: ['dashboard', 'content', 'content:article', 'content:category']
        },
        {
          id: '3',
          name: 'viewer',
          description: '只读用户',
          createTime: '2025-03-20 14:15:00',
          updateTime: '2025-08-10 09:15:45',
          permissions: ['dashboard']
        },
        {
          id: '4',
          name: 'userManager',
          description: '用户管理员',
          createTime: '2025-04-05 09:20:00',
          updateTime: '2025-08-05 16:30:15',
          permissions: ['dashboard', 'system', 'system:user']
        },
        {
          id: '5',
          name: 'roleManager',
          description: '角色管理员',
          createTime: '2025-04-25 11:05:00',
          updateTime: '2025-08-01 11:45:30',
          permissions: ['dashboard', 'system', 'system:role']
        },
        {
          id: '6',
          name: 'componentTester',
          description: '组件测试员',
          createTime: '2025-05-10 15:40:00',
          updateTime: '2025-07-28 10:12:45',
          permissions: ['dashboard', 'component']
        },
        {
          id: '7',
          name: 'articleEditor',
          description: '文章编辑',
          createTime: '2025-05-25 08:30:00',
          updateTime: '2025-07-25 14:50:20',
          permissions: ['dashboard', 'content:article']
        },
        {
          id: '8',
          name: 'categoryEditor',
          description: '分类编辑',
          createTime: '2025-06-10 13:15:00',
          updateTime: '2025-07-20 09:30:10',
          permissions: ['dashboard', 'content:category']
        },
        {
          id: '9',
          name: 'fullAccess',
          description: '全权限用户',
          createTime: '2025-06-20 16:20:00',
          updateTime: '2025-07-15 11:20:35',
          permissions: ['dashboard', 'component', 'system', 'system:user', 'system:role', 'content', 'content:article', 'content:category', 'external']
        },
        {
          id: '10',
          name: 'externalManager',
          description: '外部链接管理员',
          createTime: '2025-07-05 10:45:00',
          updateTime: '2025-07-10 15:45:50',
          permissions: ['dashboard', 'external']
        }
      ];
      
      setRoles(mockData);
      setFilteredRoles(mockData);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setIsSearching(true);
    setSearchKeyword(value);
    
    // 模拟搜索延迟
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    setSearchKeyword('');
  };

  // 处理刷新
  const handleRefresh = () => {
    setLoading(true);
    
    // 模拟刷新延迟
    setTimeout(() => {
      loadData();
      setLoading(false);
    }, 500);
  };

  // 处理新增
  const handleAdd = () => {
    setIsEditing(false);
    setCurrentRole(null);
    form.resetFields();
    form.setFieldsValue({
      permissions: []
    });
    // 新增角色时，确保全选状态为未选中
    setIsSelectAllChecked(false);
    setIsModalVisible(true);
  };

  // 处理编辑 - 带预填充数据
  const handleEdit = (record: Role) => {
    setIsEditing(true);
    setCurrentRole(record);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
      permissions: record.permissions
    });
    
    // 检查是否已选中所有权限，更新全选状态
    const allKeys = getAllPermissionKeys();
    setIsSelectAllChecked(record.permissions.length === allKeys.length && record.permissions.length > 0);
    
    setIsModalVisible(true);
  };

  // 处理删除 - 简化版实现
  const handleDelete = (id: string) => {
    
    // 使用简单的confirm对话框
    if (window.confirm('确定要删除这个角色吗？')) {
      
      // 直接更新状态
      setRoles(prevRoles => {
        const newRoles = prevRoles.filter(role => role.id !== id);
        return newRoles;
      });
      
      setFilteredRoles(prevFilteredRoles => {
        const newFilteredRoles = prevFilteredRoles.filter(role => role.id !== id);
        return newFilteredRoles;
      });
      
      // 显示成功消息
      setTimeout(() => {
        message.success('删除成功');
      }, 0);
    } else {
      console.log('用户取消删除');
    }
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (isEditing && currentRole) {
          // 更新角色
          const updatedRoles = roles.map(role => 
            role.id === currentRole.id 
              ? { ...role, ...values, updateTime: new Date().toLocaleString() }
              : role
          );
          setRoles(updatedRoles);
          message.success('角色更新成功');
        } else {
          // 新增角色
          const newRole: Role = {
            ...values,
            id: String(Date.now()),
            createTime: new Date().toLocaleString(),
            updateTime: new Date().toLocaleString()
          };
          setRoles([...roles, newRole]);
          message.success('角色创建成功');
        }
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 权限选择处理
  const handlePermissionChange = (checkedValues: string[]) => {
    form.setFieldsValue({ permissions: checkedValues });
    
    // 检查是否全部选中，更新全选状态
    const allKeys = getAllPermissionKeys();
    setIsSelectAllChecked(checkedValues.length === allKeys.length && checkedValues.length > 0);
  };

    // 获取所有权限的key - 用于全选功能
  const getAllPermissionKeys = () => {
    const keys: string[] = [];
    const collectKeys = (permissions: Permission[]) => {
      permissions.forEach(permission => {
        keys.push(permission.key);
        if (permission.children) {
          collectKeys(permission.children);
        }
      });
    };
    collectKeys(permissions);
    return keys;
  };

  // 全选权限
  const handleSelectAll = () => {
    const allPermissionKeys = getAllPermissionKeys();
    form.setFieldsValue({ permissions: allPermissionKeys });
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: React.ReactNode, record: Role) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)} 
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 递归渲染权限树
  const renderPermissionTree = (permissions: Permission[]): React.ReactElement[] => {
    return permissions.map(permission => (
      <div key={permission.key} className={styles.permissionItem}>
        <Checkbox 
          value={permission.key}
          // 移除checked属性，让CheckboxGroup统一管理选中状态
        >
          {permission.title}
        </Checkbox>
        {permission.children && permission.children.length > 0 && (
          <div className={styles.permissionChildren}>
            {renderPermissionTree(permission.children)}
          </div>
        )}
      </div>
    ));
  };


  return (
    <div className={styles.userRole}>
      <div className={styles.header}>
        <Title level={4}>角色管理</Title>
      </div>
      
      {/* 工具栏区域 */}
      <div className={styles.toolbar}>
        <div className={styles.searchSection}>
          <Search
            placeholder="请输入关键词搜索"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            loading={isSearching}
            style={{ width: 320 }}
          />
          <Button 
            onClick={handleReset} 
            style={{ marginLeft: 8,padding: '20px 16px' }}
          >
            重置
          </Button>
        </div>
        
        <div className={styles.actionSection}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ padding: '18px 16px' }}
          >
            新增
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
            style={{ marginLeft: 8, padding: '20px 16px' }}
          >
            刷新
          </Button>
        </div>
      </div>
      
      {/* 表格区域 */}
      <div className={styles.tableContainer}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredRoles}
            rowKey="id"
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `共${total}条数据`
            }}
          />
        </Spin>
      </div>
      
      {/* 新增/编辑角色弹窗 */}
      <Modal
        title={isEditing ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="确认"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {/* 角色名称 */}
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          
          {/* 角色描述 */}
          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea placeholder="请输入角色描述" rows={3} />
          </Form.Item>
          
          {/* 权限选择树 */}
          <Form.Item
            label="权限"
          >
            <div className={styles.permissionHeader}>
              {/* 修复全选Checkbox，使用独立状态管理 */}
              <Checkbox 
                checked={isSelectAllChecked}
                onChange={(e) => {
                  setIsSelectAllChecked(e.target.checked);
                  if (e.target.checked) {
                    handleSelectAll();
                  } else {
                    form.setFieldsValue({ permissions: [] });
                  }
                }}
              >
                全选
              </Checkbox>
              
              {/* 添加一个明确的取消全选按钮作为备选方案 */}
              <Button 
                type="link" 
                size="small" 
                onClick={() => {
                  form.setFieldsValue({ permissions: [] });
                  setIsSelectAllChecked(false); // 更新全选状态
                }}
                style={{ marginLeft: 16 }}
              >
                取消全选
              </Button>
              
            </div>
            <Form.Item name="permissions" noStyle initialValue={[]}>
              <CheckboxGroup onChange={handlePermissionChange}>
                <div className={styles.permissionTree}>
                  {renderPermissionTree(permissions)}
                </div>
              </CheckboxGroup>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserRole;