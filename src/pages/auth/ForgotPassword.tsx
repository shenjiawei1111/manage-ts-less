import React, { useState } from 'react';
import styles from './ForgotPassword.module.less';

interface ForgotPasswordFormData {
    username: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    verificationCode: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
    verificationCode?: string;
}

const ForgotPassword: React.FC = () => {
    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        username: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        verificationCode: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [countdown, setCountdown] = useState<number>(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    // 切换密码显示与隐藏
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // 切换确认密码显示与隐藏
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };


    // 验证手机号格式
    const handleGetVerificationCode = () => {
    const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            alert('请输入正确的手机号码');
            return;
        }

        // 启动倒计时
        setIsButtonDisabled(true);
        setCountdown(60);

        const timer = setInterval(() => {
            setCountdown((prev) => {
            if (prev === 1) {
                clearInterval(timer);
                setIsButtonDisabled(false);
                return 0;
            }
            return prev - 1;
            });
        }, 1000);
    };


    // 表单验证
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.username) {
        newErrors.username = '请输入用户名';
        }
        if (!formData.password) {
        newErrors.password = '请输入密码';
        }
        if (!formData.confirmPassword) {
        newErrors.confirmPassword = '请输入确认密码';
        }
        if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '密码和确认密码不一致';
        }
        if (!formData.phoneNumber) {
        newErrors.phoneNumber = '请输入手机号码';
        }
        if (!formData.verificationCode) {
        newErrors.verificationCode = '请输入验证码';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 处理表单提交
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        // 执行提交操作
        alert('密码重置成功');
    };

    return (
        <div className={styles.container}>
        <h2 className={styles.title}>重置密码</h2>
        <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
            <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="请输入用户名"
            />
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
            </div>

            <div className={styles.formRow}>
            <div className={styles.inputWrapper}>
                <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="请输入密码"
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={styles.showPasswordButton}
                >
                <img
                    src={showPassword ? '/src/assets/images/可视.png' : '/src/assets/images/不可视.png'}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                />
                </button>
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.formRow}>
            <div className={styles.inputWrapper}>
                <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="请确认密码"
                />
                <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className={styles.showPasswordButton}
                >
                <img
                    src={showConfirmPassword ? '/src/assets/images/可视.png' : '/src/assets/images/不可视.png'}
                    alt={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                />
                </button>

            </div>
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            <div className={styles.formRow}>
            <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="请输入手机号码"
            />
            {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
            </div>

            <div className={styles.formRow}>
            <div className={styles.inputWrapper}>
                <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder="请输入验证码"
                />
                <button
                    type="button"
                    onClick={handleGetVerificationCode}
                    className={styles.getCodeButton}
                    disabled={isButtonDisabled}
                    >
                    {countdown > 0 ? `重新获取(${countdown})` : '获取验证码'}
                </button>
            </div>
            {errors.verificationCode && <span className={styles.errorText}>{errors.verificationCode}</span>}
            </div>

            <button type="submit" className={styles.submitButton}>确认</button>
            <button type="button" className={styles.backButton} onClick={() => window.history.back()}>返回</button>
        </form>
        </div>
    );
};

export default ForgotPassword;
