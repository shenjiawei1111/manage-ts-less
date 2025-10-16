import React, { useState } from 'react';
import { DatePicker, Select, Card, Statistic, Row, Col, Typography } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import { Line, Column } from '@ant-design/charts';
import styles from './Dashboard.module.less';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard: React.FC = () => {
  // 日期范围状态
  const [dateRange, setDateRange] = useState<RangePickerProps['value']>(null);
  
  // 游戏选择状态
  const [game, setGame] = useState<string>('');
  
  // 合作公司选择状态
  const [company, setCompany] = useState<string>('');

  // 有效充值占比数据
  const lineData = [
    { date: '07-11', value1: 100, value2: 120 },
    { date: '07-12', value1: 130, value2: 110 },
    { date: '07-13', value1: 115, value2: 90 },
    { date: '07-14', value1: 180, value2: 130 },
    { date: '07-15', value1: 280, value2: 120 },
    { date: '07-16', value1: 200, value2: 100 },
    { date: '07-17', value1: 150, value2: 130 },
  ];

  // 当日充值排行数据
  const barData = [
    { name: '渣渣灰', value: 950 },
    { name: '安琪拉沫', value: 850 },
    { name: '水晶星空', value: 780 },
    { name: '丝路驼记', value: 700 },
    { name: '墨镜', value: 650 },
    { name: '六四皇', value: 600 },
    { name: '巴盟', value: 550 },
    { name: '负罪感是懦夫', value: 500 },
    { name: '叶璃草', value: 450 },
    { name: '夏至未至', value: 400 },
    { name: '浪云齐天', value: 350 },
    { name: '流觞醉气', value: 300 },
  ];

const lineConfig = {
  data: lineData, // 数据
  xField: 'date', // X轴字段
  yField: ['value1', 'value2'], // Y轴字段，可以显示多个 Y 轴
  smooth: true, // 是否平滑曲线
  animation: true,
  legend: {
    position: 'top', // 设置图例的位置
  },
  // 使用更直接的方式设置x轴样式 - 适合@ant-design/charts 2.x
  xAxis: {
    label: {
      fill: '#000000', // 直接设置字体颜色，不嵌套在style中
      fontSize: 16, // 直接设置字体大小
      fontWeight: 'bold', // 直接设置字重
    },
    line: {
      stroke: '#000000', // 直接设置线条颜色
      lineWidth: 2, // 直接设置线条宽度
    },
    tickLine: {
      stroke: '#000000', // 直接设置刻度线颜色
      lineWidth: 2, // 直接设置刻度线宽度
    },
  },
  // 使用更直接的方式设置y轴样式 - 适合@ant-design/charts 2.x
  yAxis: {
    label: {
      fill: '#000000', // 直接设置字体颜色
      fontSize: 16, // 直接设置字体大小
      fontWeight: 'bold', // 直接设置字重
    },
    line: {
      stroke: '#000000', // 直接设置线条颜色
      lineWidth: 2, // 直接设置线条宽度
    },
    tickLine: {
      stroke: '#000000', // 直接设置刻度线颜色
      lineWidth: 2, // 直接设置刻度线宽度
    },
  },
  tooltip: {
    crosshairs: {
      type: 'xy',
    },
  },
};


  // 柱状图配置
  const barConfig = {
    data: barData,
    xField: 'value',
    yField: 'name',
    isGroup: false,
    animation: true,
    legend: {
      position: 'top',
    },
    xAxis: {
      label: {
        formatter: (v: string) => `${v}`,
      },
    },
  };

  return (
    <div className={styles.dashboard}>
      {/* 筛选条件区域 */}
      <div className={styles.header}>
        <Title level={1} style={{ marginBottom: 20, marginBlock: 10 }}>仪表盘</Title>
        <Card className={styles.section}>
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
          <span style={{ lineHeight: '32px' }}>日期：</span>
          <RangePicker 
            value={dateRange} 
            onChange={(dates) => setDateRange(dates)} 
          />
          <span style={{ lineHeight: '32px' }}>游戏ID：</span>
          <Select
            placeholder="请选择游戏"
            style={{ width: 120 }}
            value={game}
            onChange={(value) => setGame(value)}
            allowClear
          >
            <Option value="game1">游戏1</Option>
            <Option value="game2">游戏2</Option>
          </Select>
          <span style={{ lineHeight: '32px' }}>合作公司：</span>
          <Select
            placeholder="请选择合作公司"
            style={{ width: 120 }}
            value={company}
            onChange={(value) => setCompany(value)}
            allowClear
          >
            <Option value="company1">公司1</Option>
            <Option value="company2">公司2</Option>
          </Select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              style={{
                padding: '4px 16px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              查询
            </button>
            <button 
              style={{
                padding: '4px 16px',
                backgroundColor: '#fff',
                color: '#666',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => {
                setDateRange(null);
                setGame('');
                setCompany('');
              }}
            >
              重置
            </button>
          </div>
          </div>
        </Card>
      </div>

      {/* 统计卡片区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>用户数</span>
              <span className={styles.statIcon}>👥</span>
            </div>
            <Statistic value={14966} precision={0} />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 10 }}>总数: 16,236</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>充值数</span>
              <span className={styles.statIcon}>💰</span>
            </div>
            <Statistic value={4286} precision={0} />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 10 }}>总数: 6,142</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>订单数</span>
              <span className={styles.statIcon}>📋</span>
            </div>
            <Statistic value={5649} precision={0} />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 10 }}>总数: 5,322</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>游戏数</span>
              <span className={styles.statIcon}>🎮</span>
            </div>
            <Statistic value={619} precision={0} />
            <div style={{ fontSize: '12px', color: '#999', marginTop: 10 }}>总数: 2,132</div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className={styles.section}>
            <Title level={4} style={{ marginBottom: '16px' }}>有效充值占比</Title>
            <div style={{ height: 300 }}>
              <Line {...lineConfig} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card className={styles.section}>
            <Title level={4} style={{ marginBottom: '16px' }}>当日充值排行</Title>
            <div style={{ height: 300 }}>
              <Column {...barConfig} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;