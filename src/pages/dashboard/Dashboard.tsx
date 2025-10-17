import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Select, Card, Statistic, Row, Col, Typography } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import * as echarts from 'echarts';
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

  // 创建echarts实例的引用
  const lineChartRef = useRef<HTMLDivElement>(null);
  const lineChartInstance = useRef<echarts.ECharts | null>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const barChartInstance = useRef<echarts.ECharts | null>(null);

  // 初始化折线图
  useEffect(() => {
    if (lineChartRef.current && !lineChartInstance.current) {
      // 初始化图表实例
      lineChartInstance.current = echarts.init(lineChartRef.current);
      
      // 图表配置选项
      const option = {
        tooltip: {
          trigger: 'axis',
          crosshair: {
            type: 'cross',
          },
        },
        legend: {
          data: ['系列1', '系列2'],
          textStyle: {
            color: '#000000',
            fontSize: 14,
          },
          top: '0%', // 将图例移到图表顶部
          left: 'center', // 水平居中
          orient: 'horizontal', // 水平排列
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '20%', // 增加顶部空间，为图例留出位置
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: lineData.map(item => item.date),
            axisLabel: {
              color: '#000000', // x轴标签颜色 - 黑色
              fontSize: 16,     // x轴标签字体大小
              fontWeight: 'normal', // 统一字体粗细
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#000000', // x轴线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#000000', // x轴刻度线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            show: true,
            axisLabel: {
              color: '#000000', // y轴标签颜色 - 黑色
              fontSize: 16,     // y轴标签字体大小
              fontWeight: 'normal', // 统一字体粗细
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#000000', // y轴线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#000000', // y轴刻度线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#999999',
                type: 'dashed',
              },
            },
          },
        ],
        series: [
          {
            name: '系列1',
            type: 'line',
            smooth: true,
            data: lineData.map(item => item.value1),
            itemStyle: {
              color: '#1890ff', // 线条颜色
            },
          },
          {
            name: '系列2',
            type: 'line',
            smooth: true,
            data: lineData.map(item => item.value2),
            itemStyle: {
              color: '#52c41a', // 线条颜色
            },
          },
        ],
      };

      // 设置图表选项
      lineChartInstance.current.setOption(option);

      // 监听窗口大小变化
      const handleResize = () => {
        lineChartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      // 组件卸载时清理
      return () => {
        window.removeEventListener('resize', handleResize);
        lineChartInstance.current?.dispose();
        lineChartInstance.current = null;
      };
    }
  }, []);

  // 初始化柱状图
  useEffect(() => {
    if (barChartRef.current && !barChartInstance.current) {
      // 初始化图表实例
      barChartInstance.current = echarts.init(barChartRef.current);
      
      // 图表配置选项
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'value',
            show: true,
            axisLabel: {
              color: '#000000', // x轴标签颜色 - 黑色
              fontSize: 16,     // x轴标签字体大小
              fontWeight: 'normal', // 统一字体粗细
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#000000', // x轴线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#000000', // x轴刻度线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#999999',
                type: 'dashed',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'category',
            data: barData.map(item => item.name),
            show: true,
            axisLabel: {
              color: '#000000', // y轴标签颜色 - 黑色
              fontSize: 16,     // y轴标签字体大小
              fontWeight: 'normal', // 统一字体粗细
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#000000', // y轴线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
            axisTick: {
              show: true,
              lineStyle: {
                color: '#000000', // y轴刻度线颜色 - 黑色
                width: 2,        // 统一线宽
              },
            },
          },
        ],
        series: [
          {
            data: barData.map(item => item.value),
            type: 'bar',
            itemStyle: {
              color: '#1890ff', // 柱状图颜色
            },
          },
        ],
      };

      // 设置图表选项
      barChartInstance.current.setOption(option);

      // 监听窗口大小变化
      const handleResize = () => {
        barChartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);

      // 组件卸载时清理
      return () => {
        window.removeEventListener('resize', handleResize);
        barChartInstance.current?.dispose();
        barChartInstance.current = null;
      };
    }
  }, []);

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
            <div style={{ height: 300 }} ref={lineChartRef}></div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card className={styles.section}>
            <Title level={4} style={{ marginBottom: '16px' }}>当日充值排行</Title>
            <div style={{ height: 300 }} ref={barChartRef}></div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;