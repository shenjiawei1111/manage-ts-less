import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '@/types'; // 确保导入了 `User` 和 `Role` 类型

// Auth Context 类型定义
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  updateUser: (user: User) => void;
}

// 创建 Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
export interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider 组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初始化时检查用户登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 检查认证状态
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return;
      }

      // 模拟用户数据
      setUser({
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin' as Role,
        permissions: ['user:list', 'user:create', 'user:edit', 'user:delete', 'dashboard:view'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      });
    } catch (error) {
      console.error('Failed to check auth status:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 登录
  const login = useCallback(async (username: string, password?: string) => {
    try {
      setIsLoading(true);
      console.log('Login attempt with:', username, password ? '******' : 'no password');
      // 模拟登录成功
      const token = 'mock-jwt-token-' + Date.now();
      const mockUser: User = {
        id: '1',
        username: username,
        email: `${username}@example.com`,
        role: username === 'admin' ? 'admin' as Role : 'editor' as Role,
        permissions: username === 'admin' 
          ? ['user:list', 'user:create', 'user:edit', 'user:delete', 'dashboard:view']
          : ['user:list', 'user:edit', 'dashboard:view'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      // 存储 token
      localStorage.setItem('token', token);
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登出
  const logout = useCallback(() => {
    // 清除 token 和用户信息
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // 检查权限
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    
    // admin 角色拥有所有权限
    if (user.role === 'admin') return true;
    
    // 检查用户是否有指定权限
    return user.permissions.includes(permission);
  }, [user]);

  // 更新用户信息
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 使用 Auth Context 的 Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// 路由守卫 Hook
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    // 可以在这里添加更多的路由守卫逻辑
  };
};
