import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Table, List, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './ModuleScroll.module.less';

// 定义数据类型
interface DataType {
  id: number;
  name: string;
  phone: string;
  age: number;
}

const ModuleScroll: React.FC = () => {
  // 生成1000条模拟数据（更合理的数量）
  const [dataSource] = useState(() => {
    const data: DataType[] = [];
    for (let i = 0; i < 1000; i++) {
      data.push({
        id: i + 1,
        name: `name${i + 1}`,
        phone: String(10000000000 + i * 13),
        age: 20 + (i * 3) % 40,
      });
    }
    return data;
  });

  // 搜索状态
  const [searchText, setSearchText] = useState('');
  
  // 虚拟滚动相关状态
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const listContainerRef = useRef<HTMLDivElement>(null);

  // 根据搜索条件过滤数据
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter(item => 
      item.name.includes(searchText) || 
      item.phone.includes(searchText) || 
      String(item.id).includes(searchText) ||
      String(item.age).includes(searchText)
    );
  }, [dataSource, searchText]);

  // 监听滚动事件，实现懒加载
  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight,} = container;
      const itemHeight = 44; // 每个列表项的高度
      const visibleCount = Math.ceil(clientHeight / itemHeight);
      const startIndex = Math.floor(scrollTop / itemHeight);
      const buffer = 5; // 缓冲区，多加载几个项目
      
      setVisibleRange({
        start: Math.max(0, startIndex - buffer),
        end: Math.min(filteredData.length, startIndex + visibleCount + buffer)
      });
    };

    container.addEventListener('scroll', handleScroll);
    // 初始触发一次
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [filteredData.length]);

  // 获取当前可见的数据项（懒加载）
  const visibleData = useMemo(() => {
    return filteredData.slice(visibleRange.start, visibleRange.end);
  }, [filteredData, visibleRange]);

  // 生成列表数据
  const listData = useMemo(() => {
    return visibleData.map((item, index) => ({ 
      ...item, 
      key: item.id,
      visibleIndex: index // 用于显示在可见区域的位置
    }));
  }, [visibleData]);

  // 表格列配置
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
  ];

  // 列表项渲染函数
  const renderItem = (item: DataType & { visibleIndex?: number }) => (
    <List.Item className={styles.listItem}>
      <div className={styles.listItemContent}>
        <span className={styles.listItemName} style={{ marginRight: 12 }}>Name {item.name.replace('name', '')}</span>
        <span className={styles.listItemCount}>ID: {item.id}(可见项: {item.visibleIndex})</span>
      </div>
    </List.Item>
  );

  // 获取表格数据 - 限制只显示10条
  const tableData = useMemo(() => {
    // 对于表格，限制只显示100条数据以提高性能
    return filteredData.slice(0, 100).map(item => ({ ...item, key: item.id }));
  }, [filteredData]);
  
  // 计算表格高度，使其与左侧列表容器保持一致
  const tableContainerHeight = 385;

  return (
    <div className={styles.moduleScroll}>
      <div className={styles.header}>
        <h1>虚拟滚动组件</h1>
      </div>
      
      <div className={styles.scrollContainer}>
            {/* 虚拟滚动列表 */}
            <div className={styles.section} style={{ height: 620 }}>
            <h2 className={styles.sectionTitle}>优化后的列表展示</h2>
            
            {/* 搜索区域 */}
            <div className={styles.searchSection}>
              <Input
                placeholder="搜索名称、电话、ID或年龄"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div className={styles.listWrapper}>
            <div 
              ref={listContainerRef}
              style={{ height: 400, overflow: 'auto', border: '1px solid #f0f0f0', borderRadius: 8 }}
            >
              {/* 通过设置padding-top和padding-bottom来创建正确的滚动条大小 */}
              <div style={{ 
                paddingTop: `${visibleRange.start * 44}px`, 
                paddingBottom: `${(filteredData.length - visibleRange.end) * 44}px` 
              }}>
                <List
                  className={styles.virtualList}
                  dataSource={listData}
                  renderItem={renderItem}
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 优化后的表格 */}
        <div className={styles.section} style={{ height: 620 }}>
          <h2 className={styles.sectionTitle}>优化后的表格展示</h2>
          <div className={styles.listWrapper}>
          <div className={styles.tableWrapper}>
            <Table
              className={styles.virtualTable}
              columns={columns}
              dataSource={tableData}
              pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) => `共 ${1000} 条数据，当前显示前${total}条`
                }}
              rowKey="id"
              size="middle"
              showHeader
              bordered
              loading={false}
              scroll={{ y: tableContainerHeight }}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ModuleScroll;