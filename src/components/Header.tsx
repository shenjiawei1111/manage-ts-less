import React, { useState } from 'react';
import type { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.less';

interface HeaderProps {
  user: User | null;
  onToggleSidebar: () => void;
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar, collapsed }) => {
  const { logout } = useAuth();

  // 控制搜索框显示
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  // 控制是否为全屏
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      logout();
    }
  };

  // 切换全屏模式
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // 切换搜索框显示
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.toggleBtn} onClick={onToggleSidebar}>
            {collapsed ? 
              <img src="/src/assets/images/展开.png" alt="Expand" /> : 
              <img src="/src/assets/images/合上.png" alt="Collapse" />
            }
        </button>
        <h1 className={styles.title}>管理系统</h1>
      </div>
      
      <div className={styles.headerRight}>
          {/* 搜索按钮 */}
          <button className={styles.iconButton} onClick={toggleSearch}>
            <img src="/src/assets/images/搜索.png" alt="Search" />
          </button>

          {/* 搜索框及弹窗 */}
          {isSearchVisible && (
            <>
              <div className={styles.overlay} onClick={toggleSearch}></div> {/* 点击遮罩关闭搜索框 */}
              <div className={styles.searchPopup}>
                <input
                  type="text"
                  placeholder="请输入搜索内容"
                  className={styles.searchInput}
                />
                <div className={styles.searchContent}>
                  <p>暂无搜索内容</p>
                  <button className={styles.closeSearch} onClick={toggleSearch}>关闭</button>
                </div>
              </div>
            </>
          )}

          {/* 全屏按钮 */}
          <button className={styles.iconButton} onClick={toggleFullscreen}>
            <img src="/src/assets/images/全屏.png" alt="Full Screen" />
          </button>

        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              <img src="/src/assets/images/人物.png" alt="User" />
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              退出登录
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;
