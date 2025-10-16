import React from 'react';
import styles from './UserRole.module.less';

const UserRole: React.FC = () => {
  return (
    <div className={styles.userRole}>
      <div className={styles.header}>
        <h1>角色管理</h1>
      </div>
      <div className={styles.content}>
        <p>角色管理内容区域</p>
      </div>
    </div>
  );
};

export default UserRole;