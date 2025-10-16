import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.less';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={styles.container}>
      <Header user={user} onToggleSidebar={toggleSidebar} collapsed={collapsed} />
      <div className={styles.contentWrapper}>
        <Sidebar collapsed={collapsed} />
        <main className={[styles.mainContent, collapsed && styles.mainContentCollapsed].join(' ')}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;