import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './Login.module.less';

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: localStorage.getItem('username') || '', // 从 localStorage 获取用户名
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false); // 记住我状态
  const navigate = useNavigate();
  const { login } = useAuth();

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除对应字段的错误信息
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // 密码显示与隐藏切换
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符';
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 5) {
      newErrors.password = '密码至少5个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    if (formData.username !== 'admin' || formData.password !== 'admin') {
      setErrors({ general: '用户名或密码错误，请重试' });
      return;
    }

    try {
      setIsLoading(true);
      
      // 记住我功能
      if (rememberMe) {
        localStorage.setItem('username', formData.username); // 保存用户名到 localStorage
      }
      
      await login(formData.username);
      navigate('/dashboard');
    } catch (_error: unknown) {
      setErrors({ general: '用户名或密码错误，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <h2 className={styles.title}>系统登录</h2>
        
        {errors.general && (
          <div className={styles.errorMessage}>{errors.general}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>用户名</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="请输入用户名"
                  className={[styles.input, errors.username && styles.inputError].join(' ')}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <span className={styles.errorText}>{errors.username}</span>
              )}
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>密码</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="请输入密码"
                  className={[styles.input, errors.password && styles.inputError].join(' ')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.showPasswordButton}
                >
                  {showPassword ? (
                    <img src="/src/assets/images/可视.png" alt="Hide password" />
                  ) : (
                    <img src="/src/assets/images/不可视.png" alt="Show password" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>
          </div>

          {/* 记住我复选框和忘记密码链接 */}
          <div className={styles.formRow}>
            <div className={styles.rememberMeContainer}>
              <label className={styles.rememberMeLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.rememberMeCheckbox}
                />
                记住我
              </label>
            </div>

            {/* 忘记密码链接 */}
            <div className={styles.forgotPassword}>
              <a href="/forgot-password">忘记密码?</a>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingContainer}>
                <span className={styles.loadingSpinner}></span>
                登录中...
              </span>
            ) : '登录'}
          </button>
          
          <div className={styles.tips}>
            <p>提示：</p>
            <p>管理员账号: admin / admin</p>
            <p>编辑账号: editor / editor</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
