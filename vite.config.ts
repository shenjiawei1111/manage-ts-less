import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 路径别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  // Less 配置
  css: {
    preprocessorOptions: {
      less: {
        // 全局变量文件
        additionalData: `@import "@/assets/styles/variables.less";`,
        javascriptEnabled: true
      }
    }
  },
  // 构建优化配置
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          common: ['@/utils/request', '@/hooks/useAuth']
        }
      }
    },
    // 减少 bloat 的 polyfill
    polyfillModulePreload: false,
    // 压缩文件命名
    outDir: 'dist',
    // 静态资源文件命名
    assetsDir: 'assets',
    // 静态资源文件名哈希
    assetsInlineLimit: 4096
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    // 代理配置，解决跨域
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
