import React from 'react';
import styles from './UserList.module.less';

const UserList: React.FC = () => {
  return (
    <div className={styles.userList}>
      <div className={styles.header}>
        <h1>用户列表</h1>
      </div>
      <div className={styles.content}>
        <p>用户列表内容区域</p>
      </div>
    </div>
  );
};

export default UserList;