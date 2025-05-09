<template>
  <div class="ai-home-page">
    <!-- 网格背景 -->
    <div class="network-bg">
      <!-- 动态网格画布 -->
      <canvas ref="networkCanvas" class="network-canvas"></canvas>
    </div>

    <!-- 主要内容区 -->
    <div class="content-container">
      <div class="hero-content-wrapper">
        <!-- 英雄区域 -->
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
            <div class="icon heart-icon">
              <Heart theme="filled" size="24" fill="#fff" />
            </div>
            <div class="data">心率: 72 BPM</div>
          </div>

          <div class="health-card steps">
            <div class="icon steps-icon">
              <CheckSmall theme="filled" size="24" fill="#fff" />
            </div>
            <div class="data">今日步数: 8,732</div>
          </div>

          <div class="health-card bmi">
            <div class="icon bmi-icon">
              <People theme="filled" size="24" fill="#fff" />
            </div>
            <div class="data">BMI: 22.3</div>
          </div>
        </div>
      </div>

      <!-- 项目介绍部分 -->
      <div class="project-intro">
        <div class="intro-container glass-effect">
          <h2 class="intro-title">智能健康管理系统</h2>
          <p class="intro-desc">基于Vue 3和Tailwind CSS 4构建的现代化健康管理平台，结合最新AI技术，为用户提供个性化健康解决方案。</p>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <Like theme="filled" size="24" />
              </div>
              <div class="feature-content">
                <h3>健康数据记录与分析</h3>
                <p>记录并可视化您的健康指标，AI分析提供个性化健康建议</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <Heart theme="filled" size="24" />
              </div>
              <div class="feature-content">
                <h3>饮食营养管理</h3>
                <p>智能饮食记录与分析，提供基于健康目标的膳食建议</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <People theme="filled" size="24" />
              </div>
              <div class="feature-content">
                <h3>个性化运动计划</h3>
                <p>根据用户健康状况和目标，制定科学合理的运动方案</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <User theme="filled" size="24" />
              </div>
              <div class="feature-content">
                <h3>AI健康助手</h3>
                <p>基于DeepSeek R1大模型，实时回答健康问题，提供专业建议</p>
              </div>
            </div>
          </div>

          <div class="tech-tags">
            <div class="tag">Vue 3</div>
            <div class="tag">TypeScript</div>
            <div class="tag">Tailwind CSS</div>
            <div class="tag">DeepSeek R1</div>
            <div class="tag">YOLOv10</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, CheckSmall, People, Like, User } from '@icon-park/vue-next'
// @ts-expect-error Vue 3.x型声明文件兼容性问题
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
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: white;
  z-index: 0;
  overflow-x: hidden;
  padding-bottom: var(--footer-height);
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
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  padding-top: calc(var(--header-height) + 2rem);
  z-index: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  /* 确保内容容器可以作为定位参考 */
}

/* 英雄内容包装器 - 新增 */
.hero-content-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rem;
  min-height: 50vh;
  position: relative;
}

/* 英雄区域 */
.hero-section {
  width: 60%;
  max-width: 600px;
  padding-top: 3rem;
  /* 增加顶部间距 */
  display: flex;
  flex-direction: column;
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
  margin-bottom: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #03c9a9, #00b3e3);
  color: white;
  border: none;
  padding: 0.75rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(3, 201, 169, 0.3);
  transition: all 0.3s ease;
  display: inline-block;
  text-decoration: none;
  font-size: 1.05rem;
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
  padding: 0.75rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  text-decoration: none;
  font-size: 1.05rem;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 健康数据卡片 */
.health-data-cards {
  position: relative;
  width: 35%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 5;
  padding-top: 0;
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

.health-card .icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.heart-rate .icon.heart-icon {
  background: linear-gradient(135deg, #14B789, #0D9A73);
  box-shadow: 0 4px 10px rgba(20, 183, 137, 0.3);
}

.steps .icon.steps-icon {
  background: linear-gradient(135deg, #2D7DFA, #0E5ED9);
  box-shadow: 0 4px 10px rgba(45, 125, 250, 0.3);
}

.bmi .icon.bmi-icon {
  background: linear-gradient(135deg, #7F5AF0, #5E3DCB);
  box-shadow: 0 4px 10px rgba(127, 90, 240, 0.3);
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

/* 项目介绍部分 */
.project-intro {
  width: 100%;
  margin-top: -5rem;
  /* 负边距使其向上移动 */
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
  /* 确保介绍部分在健康卡片之上 */
}

.intro-container {
  padding: 2.5rem;
  border-radius: 24px;
  width: 100%;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.intro-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.intro-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 800px;
  color: rgba(255, 255, 255, 0.9);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
}

.feature-icon {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.feature-content p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
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
@media (max-width: 1200px) {
  .hero-content-wrapper {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 6rem;
  }

  .hero-section {
    width: 100%;
    max-width: 600px;
    margin-bottom: 3rem;
  }

  .health-data-cards {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .health-card {
    flex: 1;
    min-width: 170px;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding-top: calc(var(--header-height) + 1rem);
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .hero-content-wrapper {
    margin-bottom: 4rem;
  }

  .health-card {
    flex: none;
    width: 100%;
  }

  .health-data-cards {
    justify-content: center;
  }

  .project-intro {
    margin-top: 0;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 1.25rem;
  }
}
</style>
