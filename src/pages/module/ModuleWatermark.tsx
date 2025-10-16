import React from 'react';
import styles from './ModuleWatermark.module.less';

const ModuleWatermark: React.FC = () => {
  return (
    <div className={styles.moduleWatermark}>
      <div className={styles.header}>
        <h1>水印组件</h1>
      </div>
      <div className={styles.content}>
        <p>水印组件内容区域</p>
      </div>
    </div>
  );
};

export default ModuleWatermark;