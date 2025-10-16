import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/MainLayout';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/auth/Login'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const Users = lazy(() => import('@/pages/system/Users'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
// 组件模块
const ModuleCut = lazy(() => import('@/pages/module/ModuleCut'));
const ModuleWatermark = lazy(() => import('@/pages/module/ModuleWatermark'));
const ModuleScroll = lazy(() => import('@/pages/module/ModuleScroll'));
const ModuleRichtext = lazy(() => import('@/pages/module/ModuleRichtext'));
// 用户管理模块
const UserList = lazy(() => import('@/pages/system/UserList'));
const UserMenu = lazy(() => import('@/pages/system/UserMenu'));
const UserRole = lazy(() => import('@/pages/system/UserRole'));
// 内容管理模块
const SettingsArticle = lazy(() => import('@/pages/content/SettingsArticle'))


// 加载中组件
const Loading: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>加载中</p>
  </div>
);

// 权限路由组件（路由守卫）
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredPermission?: string }> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    // 未登录，重定向到登录页
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // 无权限，重定向到仪表盘
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// 配置路由
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
    // 忘记密码页面路由
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<Loading />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute requiredPermission="dashboard:view">
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute requiredPermission="user:list">
            <Suspense fallback={<Loading />}>
              <Users />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // 组件模块路由
      {
        path: 'module/cut',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ModuleCut />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'module/watermark',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ModuleWatermark />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'module/scroll',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ModuleScroll />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'module/richtext',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ModuleRichtext />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // 用户管理模块路由
      {
        path: 'users/list',
        element: (
          <ProtectedRoute requiredPermission="user:list">
            <Suspense fallback={<Loading />}>
              <UserList />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/menu',
        element: (
          <ProtectedRoute requiredPermission="user:list">
            <Suspense fallback={<Loading />}>
              <UserMenu />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'users/role',
        element: (
          <ProtectedRoute requiredPermission="user:list">
            <Suspense fallback={<Loading />}>
              <UserRole />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // 内容管理模块路由
      {
        path: 'settings/article',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <SettingsArticle />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  // 404 路由
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;