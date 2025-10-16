import React from 'react';
import styles from './Users.module.less';

const Users: React.FC = () => {
  return (
    <div className={styles.users}>
      <div className={styles.header}>
        <h1>用户管理</h1>
      </div>
      
      {/* 简化为空白框架 */}
      <div className={styles.tableWrapper}>
        <p>用户管理内容区域</p>
      </div>
    </div>
  );
};

export default Users;