import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Modal, Form, 
  Select, Space, Typography, Spin, message,
  Checkbox, Dropdown, Switch, Radio,
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, 
  SearchOutlined, ReloadOutlined, FilterOutlined,
  EditOutlined, PlusCircleOutlined
} from '@ant-design/icons';
import styles from './UserList.module.less';

const { Title } = Typography;
const { Option } = Select;
const { Group: RadioGroup, Button: RadioButton } = Radio;

// 菜单数据类型定义
interface Menu {
  id: string;
  icon: string;
  title: string;
  name: string;
  type: string; // 目录、菜单、按钮
  path: string;
  status: string; // 显示、隐藏
  sort: number;
  permission: string;
  createTime: string;
  children?: Menu[];
}

// 搜索条件类型定义
interface SearchParams {
  title: string;
  name: string;
  status: string;
}

// 表格列配置项类型
interface ColumnConfig {
  key: string;
  title: string;
  visible: boolean;
}

const UserMenu: React.FC = () => {
  // 状态管理
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isAddSubMenuVisible, setIsAddSubMenuVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [parentMenu, setParentMenu] = useState<Menu | null>(null);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'id', 'icon', 'title', 'name', 'type', 'path', 'status', 'sort', 'permission', 'createTime', 'action'
  ]);
  const [form] = Form.useForm<Menu>();
  const [subMenuForm] = Form.useForm<Menu>();
  const [searchForm] = Form.useForm<SearchParams>();
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);

  // 表格列配置
  const columnConfigs: ColumnConfig[] = [
    { key: 'id', title: 'ID', visible: true },
    { key: 'icon', title: '图标', visible: true },
    { key: 'title', title: '中文菜单', visible: true },
    { key: 'name', title: '英文菜单', visible: true },
    { key: 'type', title: '类型', visible: true },
    { key: 'path', title: '路由', visible: true },
    { key: 'status', title: '状态', visible: true },
    { key: 'sort', title: '排序', visible: true },
    { key: 'permission', title: '权限标识', visible: true },
    { key: 'createTime', title: '创建时间', visible: true },
    { key: 'action', title: '操作', visible: true },
  ];

  // 初始加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 加载菜单数据
  const loadData = () => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 模拟菜单数据
      const mockData: Menu[] = [
        {
          id: '1',
          icon: 'home',
          title: '仪表盘',
          name: 'Dashboard',
          type: '菜单',
          path: '/dashboard',
          status: '显示',
          sort: 0,
          permission: '/dashboard',
          createTime: '2025-08-18 09:18',
        },
        {
          id: '2',
          icon: 'appstore',
          title: '组件',
          name: 'Components',
          type: '目录',
          path: '/demo',
          status: '显示',
          sort: 1,
          permission: '',
          createTime: '2025-08-18 09:18',
        },
        {
          id: '3',
          icon: 'setting',
          title: '系统管理',
          name: 'System Management',
          type: '目录',
          path: '/system',
          status: '显示',
          sort: 2,
          permission: '',
          createTime: '2025-08-18 09:18',
        },
        {
          id: '4',
          icon: 'file-text',
          title: '内容管理',
          name: 'Content Management',
          type: '目录',
          path: '/content',
          status: '显示',
          sort: 3,
          permission: '',
          createTime: '2025-08-18 09:18',
        },
        {
          id: '5',
          icon: 'link',
          title: '外部链接',
          name: 'External Link',
          type: '菜单',
          path: 'https://ant-design.antgroup.com/',
          status: '显示',
          sort: 4,
          permission: '/dashboard',
          createTime: '2025-08-18 09:18',
        },
        {
          id: '50',
          icon: 'clock-circle',
          title: '日志系统',
          name: 'Logging System',
          type: '菜单',
          path: '/log',
          status: '隐藏',
          sort: 1,
          permission: '/log',
          createTime: '2025-08-18 09:18',
        },
      ];
      
      // 生成更多模拟数据
      for (let i = 6; i <= 33; i++) {
        mockData.push({
          id: String(i),
          icon: 'file',
          title: `菜单项${i}`,
          name: `Menu Item ${i}`,
          type: i % 3 === 0 ? '目录' : (i % 3 === 1 ? '菜单' : '按钮'),
          path: `/menu/${i}`,
          status: i % 5 === 0 ? '隐藏' : '显示',
          sort: i % 10,
          permission: `/menu/${i}`,
          createTime: '2025-08-18 09:18',
        });
      }
      
      setMenus(mockData);
      setFilteredMenus(mockData);
      setLoading(false);
    }, 500);
  };

  // 处理搜索
  const handleSearch = (values: SearchParams) => {
    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      let filtered = [...menus];
      
      // 根据搜索条件过滤
      if (values.title) {
        filtered = filtered.filter(menu => 
          menu.title.toLowerCase().includes(values.title.toLowerCase())
        );
      }
      if (values.name) {
        filtered = filtered.filter(menu => 
          menu.name.toLowerCase().includes(values.name.toLowerCase())
        );
      }
      if (values.status) {
        filtered = filtered.filter(menu => 
          menu.status === values.status
        );
      }
      
      setFilteredMenus(filtered);
      setIsSearching(false);
    }, 500);
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    setFilteredMenus(menus);
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
    setCurrentMenu(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: Menu) => {
    setIsEditing(true);
    setCurrentMenu(record);
    form.setFieldsValue({
      id: record.id,
      icon: record.icon,
      title: record.title,
      name: record.name,
      type: record.type,
      path: record.path,
      status: record.status,
      sort: record.sort,
      permission: record.permission,
    });
    setIsModalVisible(true);
  };

  // 处理添加下级
  const handleAddSubMenu = (record: Menu) => {
    setParentMenu(record);
    subMenuForm.resetFields();
    setIsAddSubMenuVisible(true);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedMenuIds.length === 0) {
      message.warning('请先选择要删除的菜单');
      return;
    }
    
    // 模拟删除操作
    setMenus(prevMenus => prevMenus.filter(menu => !selectedMenuIds.includes(menu.id)));
    setFilteredMenus(prevMenus => prevMenus.filter(menu => !selectedMenuIds.includes(menu.id)));
    setSelectedMenuIds([]);
    setIsAllSelected(false);
    message.success('批量删除成功');
  };

  // 处理状态切换
  const handleStatusChange = (record: Menu, checked: boolean) => {
    const newStatus = checked ? '显示' : '隐藏';
    // 更新状态
    const updatedMenus = menus.map(menu => 
      menu.id === record.id ? { ...menu, status: newStatus } : menu
    );
    setMenus(updatedMenus);
    setFilteredMenus(prevMenus => 
      prevMenus.map(menu => 
        menu.id === record.id ? { ...menu, status: newStatus } : menu
      )
    );
    message.success(`状态已切换为${newStatus}`);
  };

  // 处理表单提交
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (isEditing && currentMenu) {
          // 更新菜单
          const updatedMenus = menus.map(menu =>
            menu.id === currentMenu.id
              ? { ...menu, ...values }
              : menu
          );
          setMenus(updatedMenus);
          setFilteredMenus(prevMenus => 
            prevMenus.map(menu =>
              menu.id === currentMenu.id
                ? { ...menu, ...values }
                : menu
            )
          );
          message.success('菜单更新成功');
        } else {
          // 新增菜单
          const newMenu: Menu = {
            ...values,
            id: String(Date.now()),
            createTime: new Date().toLocaleString('zh-CN'),
          };
          setMenus([...menus, newMenu]);
          setFilteredMenus([...filteredMenus, newMenu]);
          message.success('菜单创建成功');
        }
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 处理删除确认
  const handleDeleteConfirm = () => {
    if (selectedMenu) {
      // 执行删除操作
      setMenus(prevMenus => prevMenus.filter(menu => menu.id !== selectedMenu.id));
      setFilteredMenus(prevMenus => prevMenus.filter(menu => menu.id !== selectedMenu.id));
      message.success('删除成功');
      setIsDeleteModalVisible(false);
      setSelectedMenu(null);
    }
  };

  // 处理删除取消
  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedMenu(null);
  };

  // 处理添加下级菜单提交
  const handleSubMenuSubmit = () => {
    subMenuForm.validateFields()
      .then(values => {
        if (parentMenu) {
          // 新增下级菜单
          const newSubMenu: Menu = {
            ...values,
            id: String(Date.now()),
            createTime: new Date().toLocaleString('zh-CN'),
          };
          setMenus([...menus, newSubMenu]);
          setFilteredMenus([...filteredMenus, newSubMenu]);
          message.success('下级菜单创建成功');
        }
        setIsAddSubMenuVisible(false);
        setParentMenu(null);
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
            setSelectedMenuIds(checked ? filteredMenus.map(menu => menu.id) : []);
          }}
        >
          全选
        </Checkbox>
      ),
      key: 'checkbox',
      render: (_: React.ReactNode, record: Menu) => (
        <Checkbox
          checked={selectedMenuIds.includes(record.id)}
          onChange={(e) => {
            const checked = e.target.checked;
            const newSelected = checked
              ? [...selectedMenuIds, record.id]
              : selectedMenuIds.filter(id => id !== record.id);
            setSelectedMenuIds(newSelected);
            setIsAllSelected(newSelected.length === filteredMenus.length && newSelected.length > 0);
            setIsIndeterminate(
              newSelected.length > 0 && newSelected.length < filteredMenus.length
            );
          }}
        />
      ),
      // 确保选择框列始终显示，不受筛选影响
      fixed: 'left' as const,
      width: 80
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      fixed: 'left' as const,
      width: 80
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      ellipsis: true,
      render: (icon: string) => (
        <span>{icon}</span>
      )
    },
    {
      title: '中文菜单',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: '英文菜单',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      width: 80,
      render: (type: string) => (
        <span style={{ 
          color: type === '目录' ? '#1890ff' : 
                 type === '菜单' ? '#52c41a' : '#faad14' 
        }}>
          {type}
        </span>
      )
    },
    {
      title: '路由',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      width: 100,
      render: (status: string, record: Menu) => (
        <Switch
          checked={status === '显示'}
          onChange={(checked) => handleStatusChange(record, checked)}
          checkedChildren="显示"
          unCheckedChildren="隐藏"
        />
      )
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      ellipsis: true,
      width: 60
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
      key: 'permission',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_: React.ReactNode, record: Menu) => (
        <Space size={4}>
          <Button 
            type="link" 
            onClick={() => handleAddSubMenu(record)} 
            icon={<PlusCircleOutlined />}
            style={{ padding: '2px 4px', margin: 0 }}
          >
            新增下级
          </Button>
          <Button 
            type="link" 
            onClick={() => handleEdit(record)} 
            icon={<EditOutlined />}
            style={{ padding: '2px 4px', margin: 0 }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => {
              // 显示删除确认对话框
              setSelectedMenu(record);
              setIsDeleteModalVisible(true);
            }} 
            icon={<DeleteOutlined />}
            style={{ padding: '2px 4px', margin: 0 }}
          >
            删除
          </Button>
        </Space>
      )
    }
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
          setVisibleColumns(['id', 'icon', 'title', 'name', 'type', 'path', 'status', 'sort', 'permission', 'createTime', 'action']);
          setFilterVisible(false);
        }}
        style={{ marginTop: '8px', marginLeft: '8px' }}
      >
        重置
      </Button>
    </div>
  );

  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <Title level={4}>菜单管理</Title>
      </div>
      
      {/* 搜索栏区域 */}
      <div className={styles.searchBar}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch} style={{ width: '100%' }}>
          <Form.Item name="title" label="中文菜单">
            <Input placeholder="请输入" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="name" label="英文菜单">
            <Input placeholder="请输入" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择" allowClear style={{ width: 100 }}>
              <Option value="显示">显示</Option>
              <Option value="隐藏">隐藏</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSearching}>
              <SearchOutlined /> 搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleReset} style={{ padding: '16px 20px' }}>
              重置
            </Button>
          </Form.Item>
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
            disabled={selectedMenuIds.length === 0}
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
            dataSource={filteredMenus}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共${total}条数据`
            }}
          />
        </Spin>
      </div>
      
      {/* 新增/编辑菜单弹窗 */}
      <Modal
        title={isEditing ? '编辑' : '新增'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={800}  // 增加弹窗宽度
        centered
      >
        <Form
          form={form}
          layout="vertical"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Form.Item
                label="中文菜单"
                name="title"
                rules={[{ required: true, message: '请输入中文菜单' }]}
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              
              <Form.Item
                label="英文菜单"
                name="name"
                rules={[{ required: true, message: '请输入英文菜单' }]}
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '请选择类型' }]}
                className={styles.formItem}
              >
                <RadioGroup>
                  <RadioButton value="目录">目录</RadioButton>
                  <RadioButton value="菜单">菜单</RadioButton>
                  <RadioButton value="按钮">按钮</RadioButton>
                </RadioGroup>
              </Form.Item>
              
              <Form.Item
                label="路由"
                name="path"
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
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
                label="排序"
                name="sort"
                rules={[{ required: true, message: '请输入排序' }]}
                className={styles.formItem}
              >
                <Input type="number" placeholder="0" />
              </Form.Item>
              
              <Form.Item
                label="权限标识"
                name="permission"
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              
              <Form.Item
                label="图标"
                name="icon"
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>

      {/* 新增下级菜单弹窗 */}
      <Modal
        title="新增"
        open={isAddSubMenuVisible}
        onOk={handleSubMenuSubmit}
        onCancel={() => {
          setIsAddSubMenuVisible(false);
          setParentMenu(null);
        }}
        okText="确定"
        cancelText="取消"
        width={800}  // 增加弹窗宽度
        centered
      >
        <Form
          form={subMenuForm}
          layout="vertical"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Form.Item
            label="上级菜单"
            className={styles.formItem}
          >
            <Input disabled value={parentMenu?.title || ''} />
          </Form.Item>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Form.Item
                label="中文菜单"
                name="title"
                rules={[{ required: true, message: '请输入中文菜单' }]}
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              
              <Form.Item
                label="英文菜单"
                name="name"
                rules={[{ required: true, message: '请输入英文菜单' }]}
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: '请选择类型' }]}
                className={styles.formItem}
              >
                <RadioGroup>
                  <RadioButton value="目录">目录</RadioButton>
                  <RadioButton value="菜单">菜单</RadioButton>
                  <RadioButton value="按钮">按钮</RadioButton>
                </RadioGroup>
              </Form.Item>
              
              <Form.Item
                label="路由"
                name="path"
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
            
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
                className={styles.formItem}
              >
                <Select placeholder="请选择" defaultValue="显示">
                  <Option value="显示">显示</Option>
                  <Option value="隐藏">隐藏</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="排序"
                name="sort"
                rules={[{ required: true, message: '请输入排序' }]}
                className={styles.formItem}
              >
                <Input type="number" placeholder="0" defaultValue={0} />
              </Form.Item>
              
              <Form.Item
                label="权限标识"
                name="permission"
                rules={[{ required: true, message: '请输入权限标识' }]}
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              
              <Form.Item
                label="图标"
                name="icon"
                className={styles.formItem}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </div>
          </div>
          
          <Form.Item
            label="权限按钮"
            className={styles.formItem}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <Space wrap>
                <Checkbox value="create">创建</Checkbox>
                <Checkbox value="update">更新</Checkbox>
                <Checkbox value="delete">删除</Checkbox>
                <Checkbox value="detail">详情</Checkbox>
                <Checkbox value="export">导出</Checkbox>
                <Checkbox value="status">状态</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 删除确认对话框 */}
       <Modal
         title="温馨提示"
         open={isDeleteModalVisible}
         onOk={handleDeleteConfirm}
         onCancel={handleDeleteCancel}
         okText="确定"
         cancelText="取消"
         centered
         footer={[
           <Button key="cancel" onClick={handleDeleteCancel}>
             取消
           </Button>,
           <Button key="confirm" type="primary" danger onClick={handleDeleteConfirm}>
             确定
           </Button>,
         ]}
       >
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <span style={{ fontSize: '16px', color: '#faad14' }}>⚠️</span>
           <p style={{ margin: 0 }}>确定要删除 {selectedMenu?.title} 吗？</p>
         </div>
       </Modal>
    </div>
  );
};

export default UserMenu;