import React, { useState, useEffect, useRef } from 'react';
import styles from './ModuleWatermark.module.less';

const ModuleWatermark: React.FC = () => {
  // 控制水印显示状态
  const [showWatermark, setShowWatermark] = useState(true);
  // 水印容器的引用
  const watermarkContainerRef = useRef<HTMLDivElement>(null);

  // 创建水印的函数
  const createWatermark = () => {
    // 确保容器存在
    if (!watermarkContainerRef.current) return;
    
    // 清空现有的水印内容
    watermarkContainerRef.current.innerHTML = '';
    
    // 如果水印不可见，直接返回
    if (!showWatermark) return;
    
    // 创建多个水印元素，覆盖整个容器
    const watermarkText = '水印';
    const columns = 8; // 每行显示的水印数量
    const rows = 10;   // 显示的行数
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const watermarkSpan = document.createElement('span');
        watermarkSpan.className = styles.watermarkText;
        watermarkSpan.textContent = watermarkText;
        
        // 设置位置
        watermarkSpan.style.left = `${j * (100 / columns)}%`;
        watermarkSpan.style.top = `${i * (100 / rows)}%`;
        
        watermarkContainerRef.current.appendChild(watermarkSpan);
      }
    }
  };

  // 处理水印显示切换
  const toggleWatermark = (show: boolean) => {
    setShowWatermark(show);
  };

  // 页面加载和水印状态变化时创建水印
  useEffect(() => {
    createWatermark();
    
    // 监听窗口大小变化，重新创建水印
    const handleResize = () => createWatermark();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showWatermark]);

  return (
    <div className={styles.moduleWatermark}>
      {/* 水印容器 - 固定定位，覆盖整个页面 */}
      {showWatermark && (
        <div ref={watermarkContainerRef} className={styles.watermarkContainer}></div>
      )}
      
      {/* 控制按钮区域 */}
      <div className={styles.controls}>
        <button 
          className={[styles.controlButton, !showWatermark ? styles.active : ''].join(' ')}
          onClick={() => toggleWatermark(true)}
        >
          打开水印
        </button>
        <button 
          className={[styles.controlButton, showWatermark ? styles.active : ''].join(' ')}
          onClick={() => toggleWatermark(false)}
        >
          隐藏水印
        </button>
      </div>
    </div>
  );
};

export default ModuleWatermark;