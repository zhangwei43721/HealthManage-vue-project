<script setup lang="ts">
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
</script>

<template>
  <div class="app-container">
    <Header />
    <main class="content-area">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
:root {
  --header-height: 64px;
  --footer-height: 80px;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.content-area {
  flex: 1;
  position: relative;
  z-index: 1;
  width: 100%;
}

/* 使Canvas可以全屏显示 */
canvas {
  display: block;
}
</style>
