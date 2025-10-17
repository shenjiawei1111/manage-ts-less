import React, { useState } from 'react';
import styles from './ModuleCut.module.less';

const ModuleCut: React.FC = () => {
  // 输入框内容状态
  const [inputValue, setInputValue] = useState('');
  // 复制成功提示状态
  const [showSuccess, setShowSuccess] = useState(false);
  // 提示消息内容
  const [successMessage, setSuccessMessage] = useState('');

  // 复制文本到剪贴板的通用函数
  const copyToClipboard = async (text: string) => {
    try {
      // 使用现代浏览器的 Clipboard API
      await navigator.clipboard.writeText(text);
      
      // 设置成功消息并显示提示
      setSuccessMessage(`已复制: "${text}"`);
      setShowSuccess(true);
      
      // 3秒后隐藏提示
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (_err) {
      // 降级处理：创建一个临时的文本区域元素
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // 确保元素在页面上不可见但可选中
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        // 使用 document.execCommand 复制内容
        document.execCommand('copy');
        setSuccessMessage(`已复制: "${text}"`);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } catch (fallbackErr) {
        console.error('复制失败:', fallbackErr);
        alert('复制失败，请手动复制');
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  // 处理输入框复制
  const handleInputCopy = () => {
    if (inputValue.trim()) {
      copyToClipboard(inputValue.trim());
    } else {
      alert('请输入要复制的内容');
    }
  };

  // 处理复制 "admin"
  const handleAdminCopy = () => {
    copyToClipboard('admin');
  };

  return (
    <div className={styles.moduleCut}>
      <div className={styles.header}>
        <h1>剪切板功能</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.copySection}>
          <h2>剪切板：</h2>
          <div className={styles.inputGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="请输入"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              className={styles.copyButton}
              onClick={handleInputCopy}
            >
              复制
            </button>
          </div>
        </div>
        
        <div className={styles.copySection}>
          <p>将"admin"传入复制按钮中：</p>
          <button 
            className={styles.adminCopyButton}
            onClick={handleAdminCopy}
          >
            <span className={styles.copyIcon}>📋</span>
            复制
          </button>
        </div>
        
        {/* 复制成功提示 */}
        {showSuccess && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCut;