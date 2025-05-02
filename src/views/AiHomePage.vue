<template>
  <div class="ai-home-page">
    <!-- 网格背景 -->
    <div class="network-bg">
      <!-- 动态网格画布 -->
      <canvas ref="networkCanvas" class="network-canvas"></canvas>
    </div>

    <!-- 主要内容区 -->
    <div class="content-container">
      <div class="hero-section">
        <h1 class="hero-title">
          <span>AI驱动的</span>
          <span>个性化健康管理</span>
        </h1>
        <p class="hero-subtitle">基于DeepSeek R1与Yolov10，为您提供全方位的健康解决方案</p>

        <div class="hero-buttons">
          <RouterLink to="/health-data" class="btn-primary">开始体验</RouterLink>
          <RouterLink to="/about" class="btn-secondary">了解更多</RouterLink>
        </div>
      </div>

      <!-- 健康数据卡片 -->
      <div class="health-data-cards">
        <div class="health-card heart-rate">
          <div class="icon">
            <Heart theme="filled" size="24" fill="var(--color-health-success)" />
          </div>
          <div class="data">心率: 72 BPM</div>
        </div>

        <div class="health-card steps">
          <div class="icon">
            <CheckSmall theme="filled" size="24" fill="var(--color-primary)" />
          </div>
          <div class="data">今日步数: 8,732</div>
        </div>

        <div class="health-card bmi">
          <div class="icon">
            <People theme="filled" size="24" fill="var(--color-secondary)" />
          </div>
          <div class="data">BMI: 22.3</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, CheckSmall, People } from '@icon-park/vue-next'
import { ref } from 'vue'

// 网络背景Canvas引用
const networkCanvas = ref<HTMLCanvasElement | null>(null)
let animationFrame: number | null = null

// 绘制网络动画
const setupNetworkCanvas = () => {
  const canvas = networkCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置canvas尺寸为窗口大小
  const updateCanvasSize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  // 监听窗口大小变化
  window.addEventListener('resize', updateCanvasSize)
  updateCanvasSize()

  // 定义节点数量
  const numberOfNodes = 80
  const connectionDistance = 150

  // 创建节点
  const nodes: { x: number; y: number; vx: number; vy: number }[] = []

  for (let i = 0; i < numberOfNodes; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    })
  }

  // 动画循环
  const animate = () => {
    // 清除canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制连接线
    ctx.beginPath()
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i]
        const node2 = nodes[j]

        const dx = node1.x - node2.x
        const dy = node1.y - node2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          // 计算线条透明度
          const opacity = 1 - distance / connectionDistance
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`
          ctx.lineWidth = 0.5

          ctx.moveTo(node1.x, node1.y)
          ctx.lineTo(node2.x, node2.y)
        }
      }
    }
    ctx.stroke()

    // 更新和绘制节点
    for (const node of nodes) {
      // 更新位置
      node.x += node.vx
      node.y += node.vy

      // 边界检测
      if (node.x < 0 || node.x > canvas.width) {
        node.vx = -node.vx
      }

      if (node.y < 0 || node.y > canvas.height) {
        node.vy = -node.vy
      }

      // 绘制节点
      ctx.beginPath()
      ctx.arc(node.x, node.y, 1, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fill()
    }

    // 继续下一帧
    animationFrame = requestAnimationFrame(animate)
  }

  // 开始动画
  animate()

  // 返回清除函数
  return () => {
    window.removeEventListener('resize', updateCanvasSize)
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame)
    }
  }
}

// 初始化canvas
let cleanup: (() => void) | undefined = undefined

// 在组件挂载后初始化
if (typeof window !== 'undefined') {
  setTimeout(() => {
    cleanup = setupNetworkCanvas()

    // 在组件卸载前清理
    window.addEventListener('beforeunload', () => {
      if (cleanup) cleanup()
    })
  }, 100)
}
</script>

<style scoped>
.ai-home-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 80px;
  /* 为Footer留出空间 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 0;
  overflow: hidden;
  /* 防止溢出 */
}

/* 网格背景 */
.network-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #2c5282, #3182ce);
  z-index: -2;
}

/* 网络Canvas */
.network-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.network-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, transparent 0%, rgba(2, 32, 71, 0.6) 100%);
  z-index: -1;
}

/* 内容区 */
.content-container {
  position: relative;
  max-width: 1200px;
  width: 100%;
  padding: 0 2rem;
  z-index: 1;
  margin-top: var(--header-height);
  /* 为Header留出空间 */
}

/* 英雄区域 */
.hero-section {
  margin-bottom: 6rem;
  max-width: 800px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  max-width: 600px;
}

/* 按钮 */
.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-primary {
  background: linear-gradient(135deg, #03c9a9, #00b3e3);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(3, 201, 169, 0.3);
  transition: all 0.3s ease;
  display: inline-block;
  text-decoration: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(3, 201, 169, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  text-decoration: none;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 健康数据卡片 */
.health-data-cards {
  position: absolute;
  top: 20%;
  right: 5%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transform: translateY(50%);
}

.health-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 180px;
  animation: float 4s ease-in-out infinite;
}

.health-card.heart-rate {
  animation-delay: 0s;
}

.health-card.steps {
  animation-delay: 0.5s;
}

.health-card.bmi {
  animation-delay: 1s;
}

.health-card .data {
  font-weight: 600;
  letter-spacing: 0.5px;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }

  .health-data-cards {
    position: static;
    transform: none;
    margin-top: 2rem;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .hero-section {
    margin-bottom: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero-subtitle {
    text-align: center;
  }
}
</style>
