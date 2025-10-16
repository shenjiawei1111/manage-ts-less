import type { ApiResponse } from '@/types';

// 请求配置类型
interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
}

class Request {
  private baseURL: string;
  private timeout: number;
  private pendingRequests: Map<string, AbortController>;

  constructor() {
    this.baseURL = '/api';
    this.timeout = 30000;
    this.pendingRequests = new Map();
  }

  // 生成请求唯一标识
  private getRequestKey(url: string, params: Record<string, any> = {}): string {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}?${paramString}`;
  }

  // 取消重复请求
  private cancelDuplicateRequest(url: string, params: Record<string, any> = {}): void {
    const requestKey = this.getRequestKey(url, params);
    if (this.pendingRequests.has(requestKey)) {
      const controller = this.pendingRequests.get(requestKey);
      controller?.abort();
      this.pendingRequests.delete(requestKey);
    }
  }

  // 添加请求到待处理列表
  private addPendingRequest(url: string, params: Record<string, any> = {}): AbortController {
    const requestKey = this.getRequestKey(url, params);
    const controller = new AbortController();
    this.pendingRequests.set(requestKey, controller);
    return controller;
  }

  // 移除待处理请求
  private removePendingRequest(url: string, params: Record<string, any> = {}): void {
    const requestKey = this.getRequestKey(url, params);
    this.pendingRequests.delete(requestKey);
  }

  // 构建 URL
  private buildUrl(url: string, params?: Record<string, any>): string {
    let fullUrl = `${this.baseURL}${url}`;
    
    if (!params) return fullUrl;
    
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key]);
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
  }

  // 请求拦截
  private async request<T = any>(
    method: string,
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout = this.timeout, headers, ...restConfig } = config;
    
    // 取消重复请求
    this.cancelDuplicateRequest(url, params);
    const controller = this.addPendingRequest(url, params);
    
    try {
      // 设置超时
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // 准备请求头
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(headers as Record<string, string>),
      };
      
      // 获取 token
      const token = localStorage.getItem('token');
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
      
      // 发送请求
      const response = await fetch(this.buildUrl(url, params), {
        method,
        headers: requestHeaders,
        signal: controller.signal,
        ...restConfig,
      });
      
      clearTimeout(timeoutId);
      
      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 解析响应
      const data: ApiResponse<T> = await response.json();
      
      // 处理业务错误
      if (data.code !== 0) {
        // 处理特定错误码
        if (data.code === 401) {
          // 未授权，清除 token 并重定向到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw error;
    } finally {
      // 移除待处理请求
      this.removePendingRequest(url, params);
    }
  }

  // GET 请求
  get<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request('GET', url, config);
  }

  // POST 请求
  post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request('POST', url, {
      ...config,
      body: JSON.stringify(data),
    });
  }

  // PUT 请求
  put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request('PUT', url, {
      ...config,
      body: JSON.stringify(data),
    });
  }

  // DELETE 请求
  delete<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request('DELETE', url, config);
  }

  // PATCH 请求
  patch<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request('PATCH', url, {
      ...config,
      body: JSON.stringify(data),
    });
  }
}

// 导出请求实例
export default new Request();