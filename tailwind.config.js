/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Scan Vue and TS/JS files
  ],
  theme: {
    extend: {
      colors: {
        // 主要颜色
        primary: {
          light: '#4ade80', // 浅绿色
          DEFAULT: '#10b981', // 健康绿
          dark: '#059669', // 深绿色
        },
        // 辅助颜色
        secondary: {
          light: '#93c5fd', // 浅蓝色
          DEFAULT: '#3b82f6', // 蓝色
          dark: '#2563eb', // 深蓝色
        },
        // 健康相关颜色
        health: {
          success: '#22c55e', // 健康状态良好
          warning: '#f59e0b', // 需要注意
          danger: '#ef4444', // 危险警告
        },
        // 背景颜色
        background: {
          light: '#f0fdf4', // 浅绿背景
          DEFAULT: '#f9fafb', // 默认背景
          dark: '#1f2937', // 暗模式背景
        },
        // 文字颜色
        text: {
          primary: '#111827', // 主要文字
          secondary: '#4b5563', // 次要文字
          light: '#9ca3af', // 浅色文字
        },
      },
    },
  },
  plugins: [],
}
