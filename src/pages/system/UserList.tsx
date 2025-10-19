import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Modal, Form, 
  Select, Space, Typography, Spin, message,
  Checkbox, Dropdown
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, 
  SearchOutlined, ReloadOutlined, FilterOutlined
} from '@ant-design/icons';
import styles from './UserList.module.less';

const { Title } = Typography;
const { Option } = Select;

// 用户数据类型定义
interface User {
  id: string;
  username: string;
  name1: string;
  name2: string;
  name3: string;
  name4: string;
  name5: string;
  email: string;
  phone: string;
  status: string;
  roles: string[];
  url: string;
}

// 搜索条件类型定义
interface SearchParams {
  name: string;
  email: string;
  phone: string;
  name1: string;
  name2: string;
  name3: string;
  name4: string;
  name5: string;
}

// 表格列配置项类型
interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
}

const UserList: React.FC = () => {
  // 状态管理
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'id', 'username', 'name1', 'status', 'roles', 'phone', 'email', 'url', 'action'
  ]);
  const [form] = Form.useForm<User>();
  const [searchForm] = Form.useForm<SearchParams>();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);

  // 表格列配置
  const columnConfigs: ColumnConfig[] = [
    { key: 'id', title: 'ID', visible: true },
    { key: 'username', title: '用户名', visible: true },
    { key: 'name1', title: '名称', visible: true },
    { key: 'status', title: '状态', visible: true },
    { key: 'roles', title: '角色', visible: true },
    { key: 'phone', title: '手机', visible: true },
    { key: 'email', title: '邮箱', visible: true },
    { key: 'url', title: 'URL', visible: true },
    { key: 'action', title: '操作', visible: true },
  ];

  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 加载用户数据
  const loadData = () => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 模拟数据
      const mockData: User[] = [
        {
          id: '0',
          username: '用户1',
          name1: '用户名称1',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '1',
          username: '用户2',
          name1: '用户名称2',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '2',
          username: '用户3',
          name1: '用户名称3',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '3',
          username: '用户4',
          name1: '用户名称4',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '4',
          username: '用户5',
          name1: '用户名称5',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '5',
          username: '用户6',
          name1: '用户名称6',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '6',
          username: '用户7',
          name1: '用户名称7',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '7',
          username: '用户8',
          name1: '用户名称8',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
        {
          id: '8',
          username: '用户9',
          name1: '用户名称9',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          email: 'user1@example.com',
          phone: '13000000000',
          status: '显示',
          roles: ['系统管理员', '普通用户'],
          url: 'https://github.com/southli',
        },
      ];
      
      setUsers(mockData);
      setFilteredUsers(mockData);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values: SearchParams) => {
    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      let filtered = [...users];
      
      // 根据搜索条件过滤
      if (values.name) {
        filtered = filtered.filter(user => 
          user.username.toLowerCase().includes(values.name.toLowerCase()) ||
          user.name1.toLowerCase().includes(values.name.toLowerCase())
        );
      }
      if (values.email) {
        filtered = filtered.filter(user => 
          user.email.toLowerCase().includes(values.email.toLowerCase())
        );
      }
      if (values.phone) {
        filtered = filtered.filter(user => 
          user.phone.includes(values.phone)
        );
      }
      if (values.name1) {
        filtered = filtered.filter(user => 
          user.name1.toLowerCase().includes(values.name1.toLowerCase())
        );
      }
      if (values.name2) {
        filtered = filtered.filter(user => 
          user.name2.toLowerCase().includes(values.name2.toLowerCase())
        );
      }
      if (values.name3) {
        filtered = filtered.filter(user => 
          user.name3.toLowerCase().includes(values.name3.toLowerCase())
        );
      }
      if (values.name4) {
        filtered = filtered.filter(user => 
          user.name4.toLowerCase().includes(values.name4.toLowerCase())
        );
      }
      if (values.name5) {
        filtered = filtered.filter(user => 
          user.name5.toLowerCase().includes(values.name5.toLowerCase())
        );
      }
      
      setFilteredUsers(filtered);
      setIsSearching(false);
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredUsers(users);
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
    setCurrentUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: User) => {
    setIsEditing(true);
    setCurrentUser(record);
    form.setFieldsValue({
      id: record.id,
      username: record.username,
      name1: record.name1,
      email: record.email,
      phone: record.phone,
      status: record.status,
      roles: record.roles,
      url: record.url,
    });
    setIsModalVisible(true);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedUserIds.length === 0) {
      message.warning('请先选择要删除的用户');
      return;
    }
    
    setConfirmModalType('batch');
    setConfirmModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (isEditing && currentUser) {
          // 更新用户
          const updatedUsers = users.map(user =>
            user.id === currentUser.id
              ? { ...user, ...values }
              : user
          );
          setUsers(updatedUsers);
          setFilteredUsers(prevUsers => 
            prevUsers.map(user =>
              user.id === currentUser.id
                ? { ...user, ...values }
                : user
            )
          );
          message.success('用户更新成功');
        } else {
          // 新增用户
          const newUser: User = {
            ...values,
            id: String(Date.now()),
            name2: values.name2 || '',
            name3: values.name3 || '',
            name4: values.name4 || '',
            name5: values.name5 || '',
            roles: values.roles || ['普通用户'],
          };
          setUsers([...users, newUser]);
          setFilteredUsers([...filteredUsers, newUser]);
          message.success('用户创建成功');
        }
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 处理列显示切换
  const handleColumnVisibilityChange = (key: string, visible: boolean) => {
    if (visible) {
      setVisibleColumns(prev => [...prev, key]);
    } else {
      setVisibleColumns(prev => prev.filter(col => col !== key));
    }
  };

  // 处理全选列
  const handleSelectAllColumns = (checked: boolean) => {
    if (checked) {
      setVisibleColumns(columnConfigs.map(col => col.key));
    } else {
      // 保留操作列
      setVisibleColumns(['action']);
    }
  };

  // 检查是否所有列都被选中
  const isAllColumnsSelected = visibleColumns.length === columnConfigs.length;

  // 表格列定义
  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllSelected}
          onChange={(e) => {
            const checked = e.target.checked;
            setIsAllSelected(checked);
            setIsIndeterminate(false);
            setSelectedUserIds(checked ? filteredUsers.map(user => user.id) : []);
          }}
        >
          全选
        </Checkbox>
      ),
      key: 'checkbox',
      render: (_: React.ReactNode, record: User) => (
        <Checkbox
          checked={selectedUserIds.includes(record.id)}
          onChange={(e) => {
            const checked = e.target.checked;
            const newSelected = checked
              ? [...selectedUserIds, record.id]
              : selectedUserIds.filter(id => id !== record.id);
            setSelectedUserIds(newSelected);
            setIsAllSelected(newSelected.length === filteredUsers.length && newSelected.length > 0);
            setIsIndeterminate(
              newSelected.length > 0 && newSelected.length < filteredUsers.length
            );
          }}
        />
      ),
      // 确保选择框列始终显示，不受筛选影响
      fixed: 'left' as const,
      width: 80,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      fixed: 'left' as const,
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name1',
      key: 'name1',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      render: (status: string) => (
        <span style={{ color: status === '显示' ? '#52c41a' : '#d9d9d9' }}>
          {status}
        </span>
      ),
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      ellipsis: true,
      render: (roles: string[]) => roles.join(', '),
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: React.ReactNode, record: User) => (
        <Space size="middle">
            <Button 
              type="link" 
              onClick={() => handleEdit(record)} 
            >
              编辑
            </Button>
            <Button 
              type="link" 
              danger 
              onClick={() => {
                setConfirmModalType('single');
                setConfirmDeleteId(record.id);
                setConfirmModalVisible(true);
              }} 
            >
              删除
            </Button>
          </Space>
      ),
    },
  ].filter(column => visibleColumns.includes(column.key));

  // 列筛选下拉菜单
  const filterMenu = (
    <div className={styles.filterDropdown}>
      <div className={styles.filterDropdownItem}>
        <Checkbox
          checked={isAllColumnsSelected}
          onChange={(e) => handleSelectAllColumns(e.target.checked)}
        >
          全选
        </Checkbox>
      </div>
      {columnConfigs.map(config => (
        <div key={config.key} className={styles.filterDropdownItem}>
          <Checkbox
            checked={visibleColumns.includes(config.key)}
            onChange={(e) => handleColumnVisibilityChange(config.key, e.target.checked)}
          >
            {config.title}
          </Checkbox>
        </div>
      ))}
      <Button 
        type="link" 
        onClick={() => {
          setVisibleColumns(['id', 'username', 'name1', 'status', 'roles', 'phone', 'email', 'url', 'action']);
          setFilterVisible(false);
        }}
        style={{ marginTop: '8px', marginLeft: '8px' }}
      >
        重置
      </Button>
    </div>
  );

  // 确认对话框状态
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalType, setConfirmModalType] = useState<'single' | 'batch'>('single');
  const [confirmDeleteId, setConfirmDeleteId] = useState('');

  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <Title level={4}>用户管理</Title>
      </div>
      
      {/* 搜索栏区域 */}
      <div className={styles.searchBar}>
        <Form form={searchForm} layout="horizontal" onFinish={handleSearch} className="fullWidthForm">
          <div className="searchFormWrapper">
            <div className={styles.searchFormRow}>
              <Form.Item name="name" label="请选择" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item name="email" label="邮箱" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item name="phone" label="手机" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item name="name1" label="名称1" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            <div className={styles.searchFormRow}>
              <Form.Item name="name2" label="名称2" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item name="name3" label="名称3" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item name="name4" label="名称4" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item name="name5" label="名称5" className={styles.searchFormItem}>
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            <div className={styles.searchFormButtons}>
              <Button type="primary" htmlType="submit" loading={isSearching}>
                <SearchOutlined /> 搜索
              </Button>
              <Button onClick={handleReset} style={{ marginLeft: 8 }}>
                重置
              </Button>
            </div>
          </div>
        </Form>
      </div>
      
      {/* 操作栏区域 */}
      <div className={styles.actionBar}>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增
          </Button>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
            disabled={selectedUserIds.length === 0}
            style={{ marginLeft: '8px' }}
          >
            批量删除
          </Button>
        </div>
        <div>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
            style={{ marginRight: '8px' }}
          >
            刷新
          </Button>
          <Dropdown 
            overlay={filterMenu} 
            visible={filterVisible}
            onVisibleChange={setFilterVisible}
            trigger={['click']}
            getPopupContainer={(triggerNode) => {
                const parent = triggerNode.parentElement;
                return parent || document.body;
              }}
          >
            <Button icon={<FilterOutlined />}>
              列筛选
            </Button>
          </Dropdown>
        </div>
      </div>
      
      {/* 表格区域 */}
      <div className={styles.tableContainer}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共${total}条数据`
            }}
          />
        </Spin>
      </div>
      
      {/* 新增/编辑用户弹窗 */}
      <Modal
        title={isEditing ? '编辑' : '新增'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
            className={styles.formItem}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: !isEditing, message: '请输入密码' }]}
            className={styles.formItem}
          >
            <Input.Password placeholder="请输入" />
          </Form.Item>
          
          <Form.Item
            label="名称"
            name="name1"
            rules={[{ required: true, message: '请输入名称' }]}
            className={styles.formItem}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          
          <Form.Item
            label="角色"
            name="roles"
            rules={[{ required: true, message: '请选择角色' }]}
            className={styles.formItem}
          >
            <Select placeholder="请选择" mode="multiple">
              <Option value="系统管理员">系统管理员</Option>
              <Option value="普通用户">普通用户</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
            className={styles.formItem}
          >
            <Select placeholder="请选择">
              <Option value="显示">显示</Option>
              <Option value="隐藏">隐藏</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="手机"
            name="phone"
            className={styles.formItem}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          
          <Form.Item
            label="邮箱"
            name="email"
            className={styles.formItem}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          
          <Form.Item
            label="URL"
            name="url"
            className={styles.formItem}
          >
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 删除确认对话框 */}
      <Modal
        title="温馨提示"
        open={confirmModalVisible}
        onOk={() => {
          if (confirmModalType === 'single') {
            // 删除单个用户
            setUsers(prevUsers => prevUsers.filter(user => user.id !== confirmDeleteId));
            setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== confirmDeleteId));
            message.success('删除成功');
          } else {
            // 批量删除
            setUsers(prevUsers => prevUsers.filter(user => !selectedUserIds.includes(user.id)));
            setFilteredUsers(prevUsers => prevUsers.filter(user => !selectedUserIds.includes(user.id)));
            setSelectedUserIds([]);
            setIsAllSelected(false);
            setIsIndeterminate(false);
            message.success('批量删除成功');
          }
          setConfirmModalVisible(false);
        }}
        onCancel={() => setConfirmModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={400}
        centered
      >
        <p>
          {confirmModalType === 'single' 
            ? '确定要删除这个用户吗？' 
            : `确定要批量删除选中的 ${selectedUserIds.length} 个用户吗？`
          }
        </p>
      </Modal>
    </div>
  );
};

export default UserList;