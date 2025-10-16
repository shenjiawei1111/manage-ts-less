import React from 'react';
import styles from './ModuleCut.module.less';

const ModuleCut: React.FC = () => {
  return (
    <div className={styles.moduleCut}>
      <div className={styles.header}>
        <h1>剪切板组件</h1>
      </div>
      <div className={styles.content}>
        <p>剪切板组件内容区域</p>
      </div>
    </div>
  );
};

export default ModuleCut;