import React from 'react';
import styles from './ModuleRichtext.module.less';

const ModuleRichtext: React.FC = () => {
  return (
    <div className={styles.moduleRichtext}>
      <div className={styles.header}>
        <h1>富文本组件</h1>
      </div>
      <div className={styles.content}>
        <p>富文本组件内容区域</p>
      </div>
    </div>
  );
};

export default ModuleRichtext;