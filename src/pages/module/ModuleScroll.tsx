import React from 'react';
import styles from './ModuleScroll.module.less';

const ModuleScroll: React.FC = () => {
  return (
    <div className={styles.moduleScroll}>
      <div className={styles.header}>
        <h1>虚拟滚动组件</h1>
      </div>
      <div className={styles.content}>
        <p>虚拟滚动组件内容区域</p>
      </div>
    </div>
  );
};

export default ModuleScroll;