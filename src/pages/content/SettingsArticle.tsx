import React from 'react';
import styles from './SettingsArticle.module.less';

const SettingsArticle: React.FC = () => {
  return (
    <div className={styles.settingsArticle}>
      <div className={styles.header}>
        <h1>文章管理</h1>
      </div>
      <div className={styles.content}>
        <p>文章管理内容区域</p>
      </div>
    </div>
  );
};

export default SettingsArticle;