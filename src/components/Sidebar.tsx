import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { MenuItem } from '@/types';
import styles from './Sidebar.module.less';

interface SidebarProps {
  collapsed: boolean;
}

// 菜单项配置
const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    path: '/dashboard',
    icon: '📊',
    permissions: ['dashboard:view']
  },
  {
    key:'module',
    label: '组件',
    path: '/module',
    icon: '📦',
    children: [
      {
        key: 'module-cut',
        label: '剪切板',
        path: '/module/cut',
      },
      {
        key: 'module-watermark',
        label: '水印',
        path: '/module/watermark',
      },
      {
        key: 'module-scroll',
        label: '虚拟滚动',
        path: '/module/scroll',
      },
      {
        key: 'module-richtext',
        label: '富文本',
        path: '/module/richtext',
      },
    ]
  },
  {
    key: 'users',
    label: '系统管理',
    path: '/users',
    icon: '👥',
    permissions: ['user:list'],
    children: [
      {
        key: 'user-list',
        label: '用户管理',
        path: '/users/list',
      },
      {
        key: 'user-menu',
        label: '菜单管理',
        path: '/users/menu',
      },
      {
        key: 'user-role',
        label: '角色管理',
        path: '/users/role',
      },
    ]
  },

  {
    key: 'settings',
    label: '内容管理',
    icon: '📝',
    children: [
      {
        key: 'settings-article',
        label: '文章管理',
        path: '/settings/article',
        permissions: []
      },
    ],
    permissions: []
  },

  { 
    key: 'external-links',
    label: '外部链接',
    icon: '🔗',
    url: 'https://github.com/shenjiawei1111/manage-ts-less/tree/master/src/pages/dashboard' // 外部链接URL
  }
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  const { hasPermission } = useAuth();

  // 过滤有权限的菜单项
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter(item => {
        // 检查父菜单项权限
        if (item.permissions && item.permissions.length > 0) {
          const hasParentPermission = item.permissions.some(permission => hasPermission(permission));
          if (!hasParentPermission) return false;
        }
        
        // 递归过滤子菜单项
        if (item.children && item.children.length > 0) {
          item.children = filterMenuItems(item.children);
          // 如果子菜单都被过滤掉了，父菜单也不显示
          if (item.children.length === 0) return false;
        }
        
        return true;
      });
  };

  // 使用 useMemo 缓存过滤后的菜单项，避免每次渲染时都计算
  const filteredMenuItems = useMemo(() => filterMenuItems(menuItems), [menuItems, hasPermission]);

  // 展开包含当前路径的菜单项
  React.useEffect(() => {
    const newOpenKeys: string[] = [];
    const findOpenKeys = (items: MenuItem[]) => {
      items.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(child => 
            location.pathname.startsWith(child.path || '')
          );
          if (hasActiveChild) {
            newOpenKeys.push(item.key);
            findOpenKeys(item.children);
          }
        }
      });
    };
    findOpenKeys(filteredMenuItems);
    setOpenKeys(newOpenKeys);
  }, [location.pathname, filteredMenuItems]);

  // 切换子菜单展开/收起
  const toggleSubMenu = (key: string) => {
    setOpenKeys(prevKeys => {
      if (prevKeys.includes(key)) {
        return prevKeys.filter(k => k !== key);
      } else {
        return [...prevKeys, key];
      }
    });
  };

  // 渲染菜单项
  const renderMenuItem = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      const isOpen = openKeys.includes(item.key);
      
      return (
        <li key={item.key} className={styles.menuItem}>
          <button
            className={styles.subMenuTitle}
            onClick={() => toggleSubMenu(item.key)}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
            <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>
              {isOpen ? '▼' : '▶'}
            </span>
          </button>
          <ul className={`${styles.subMenu} ${isOpen ? styles.subMenuOpen : ''}`}>
            {item.children.map(child => renderMenuItem(child))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.key} className={styles.menuItem}>
        {item.url ? (
          // 处理外部链接，使用a标签并设置target="_blank"在新窗口打开
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.menuLink}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
          </a>
        ) : (
          <NavLink
            to={item.path || ''}
            className={({ isActive }) => 
              isActive ? styles.activeLink : styles.menuLink
            }
            end
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
          </NavLink>
        )}
      </li>
    );
  };

  return (
    <aside className={[styles.sidebar, collapsed && styles.collapsed].join(' ')}>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {filteredMenuItems.map(item => renderMenuItem(item))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
