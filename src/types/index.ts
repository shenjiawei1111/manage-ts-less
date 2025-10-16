// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export type Role = 'admin' | 'editor' | 'viewer';

// 权限相关类型
export interface Permission {
  id: string;
  name: string;
  description: string;
}

// 分页相关类型
export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface PaginatedList<T> {
  list: T[];
  pagination: Pagination;
}

// 通用响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 表格相关类型
export interface TableColumn<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  width?: number;
  render?: (text: T[keyof T], record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  searchable?: boolean;
}

// 表单相关类型
export interface FormField<T> {
  name: keyof T;
  label: string;
  type: 'input' | 'select' | 'radio' | 'checkbox' | 'date' | 'textarea';
  placeholder?: string;
  rules?: FormRule[];
  options?: { label: string; value: string | number | boolean }[];
  defaultValue?: T[keyof T];
}

export interface FormRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  validator?: (value: unknown) => boolean;
}

// 路由相关类型
export interface RouteItem {
  path: string;
  name: string;
  component: React.ComponentType<Record<string, unknown>>;
  icon?: React.ReactNode;
  children?: RouteItem[];
  permissions?: string[];
  exact?: boolean;
}

// 侧边栏菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
  url?: string; // 外部链接URL
  permissions?: string[];
}