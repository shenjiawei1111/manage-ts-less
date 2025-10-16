import React from 'react';
import styles from './UserMenu.module.less';

const UserMenu: React.FC = () => {
  return (
    <div className={styles.userMenu}>
      <div className={styles.header}>
        <h1>菜单管理</h1>
      </div>
      <div className={styles.content}>
        <p>菜单管理内容区域</p>
      </div>
    </div>
  );
};

export default UserMenu;