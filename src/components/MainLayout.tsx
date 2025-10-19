import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.less';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [key, setKey] = useState<string>('');
  const { user } = useAuth();
  const location = useLocation();

  // 监听路由变化，触发动画
  useEffect(() => {
    // 先设置为动画状态
    setIsAnimating(true);
    
    // 清除旧的key，准备渲染新内容
    setKey('');
    
    // 延迟一下确保旧内容开始动画后再设置新的key
    const timer1 = setTimeout(() => {
      setKey(location.pathname);
    }, 100);
    
    // 动画结束后重置状态
    const timer2 = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // 完整动画持续时间
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={styles.container}>
      <Header user={user} onToggleSidebar={toggleSidebar} collapsed={collapsed} />
      <div className={styles.contentWrapper}>
        <Sidebar collapsed={collapsed} />
        <main className={[styles.mainContent, collapsed && styles.mainContentCollapsed].join(' ')}>
          <div className={styles.transitionWrapper}>
            <div 
              className={`${styles.transitionContainer} ${isAnimating ? styles.transitionOut : styles.transitionIn}`} 
              key={key || 'empty'}
            >
              {key && (children || <Outlet />)}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;