<script setup lang="ts">
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />
    <div class="pt-20 py-8 px-4 md:px-8 flex-grow">
      <main class="max-w-6xl mx-auto w-full">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
