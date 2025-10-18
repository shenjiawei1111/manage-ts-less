import React, { useRef, useEffect } from 'react';
import styles from './ModuleRichtext.module.less';

const ModuleRichtext: React.FC = () => {
  // 编辑器引用
  const editorRef = useRef<HTMLDivElement>(null);

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = 'hello';
    }
  }, []);

  // 使用 document.execCommand 实现文本格式化
  const handleFormat = (formatType: string) => {
    // 保存当前选择范围
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // 执行格式化命令
    try {
      document.execCommand('formatBlock', false, 'p'); // 确保在块级元素内
      
      switch (formatType) {
        case 'bold':
          document.execCommand('bold', false, '');
          break;
        case 'italic':
          document.execCommand('italic', false, '');
          break;
        case 'underline':
          document.execCommand('underline', false, '');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('格式化失败:', error);
    }
  };

  // 简单的格式控制处理（实际项目中可能需要更复杂的实现）
  const handleSimpleFormat = (formatType: string) => {
    try {
      switch (formatType) {
        case 'alignLeft':
          document.execCommand('justifyLeft', false, '');
          break;
        case 'alignCenter':
          document.execCommand('justifyCenter', false, '');
          break;
        case 'alignRight':
          document.execCommand('justifyRight', false, '');
          break;
        case 'insertUnorderedList':
          document.execCommand('insertUnorderedList', false, '');
          break;
        case 'insertOrderedList':
          document.execCommand('insertOrderedList', false, '');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('格式控制失败:', error);
    }
  };

  // 处理特殊功能按钮
  const handleSpecialAction = (actionType: string) => {
    if (actionType === 'insertLink') {
      const url = prompt('请输入链接地址:');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else if (actionType === 'insertImage') {
      const imgUrl = prompt('请输入图片地址:');
      if (imgUrl) {
        document.execCommand('insertImage', false, imgUrl);
      }
    }
    // 其他特殊功能可以在这里添加
  };

  return (
    <div className={styles.moduleRichtext}>
      <div className={styles.header}>
        <h1>富文本编辑器</h1>
      </div>
      <div className={styles.editorContainer}>
        {/* 工具栏 */}
        <div className={styles.toolbar}>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleFormat('bold')}
            title="粗体"
          >
            <strong>B</strong>
          </button>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleFormat('italic')}
            title="斜体"
          >
            <em>I</em>
          </button>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleFormat('underline')}
            title="下划线"
          >
            <u>U</u>
          </button>
          <span className={styles.separator}></span>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleSimpleFormat('alignLeft')}
            title="左对齐"
          >
            <span>≡</span>
          </button>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleSimpleFormat('alignCenter')}
            title="居中对齐"
          >
            <span>≡|</span>
          </button>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleSimpleFormat('alignRight')}
            title="右对齐"
          >
            <span>|≡</span>
          </button>
          <span className={styles.separator}></span>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleSimpleFormat('insertUnorderedList')}
            title="无序列表"
          >
            <span>•</span>
          </button>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleSimpleFormat('insertOrderedList')}
            title="有序列表"
          >
            <span>1.</span>
          </button>
          <span className={styles.separator}></span>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleSpecialAction('insertLink')}
            title="插入链接"
          >
            <span>🔗</span>
          </button>
          <button 
            className={styles.toolbarButton}
            onClick={() => handleSpecialAction('insertImage')}
            title="插入图片"
          >
            <span>🖼️</span>
          </button>
          <span className={styles.separator}></span>
        </div>
        
        {/* 编辑区域 - 移除了 dangerouslySetInnerHTML，避免光标位置丢失 */}
        <div 
          ref={editorRef}
          className={styles.editor}
          contentEditable
          suppressContentEditableWarning={true}
          style={{ position: 'relative' }}
          onPaste={(e) => {
             // 可选：处理粘贴事件，清理粘贴的格式
            e.preventDefault();
            const text = e.clipboardData ? e.clipboardData.getData('text/plain') : '';
            document.execCommand('insertText', false, text);
          }}
        />
      </div>
    </div>
  );
};

export default ModuleRichtext;