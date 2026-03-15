<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Card from '@/components/base/Card.vue';
import Button from '@/components/base/Button.vue';
import InputField from '@/components/base/InputField.vue';
import { User as UserIcon, Lock } from '@icon-park/vue-next';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
});

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

// 错误信息
const errorMessage = ref('');
const loading = ref(false);

// 获取重定向路径
const redirectPath = ref('/');
const redirect = route.query.redirect as string;
if (redirect) {
  redirectPath.value = redirect;
}

// 表单提交
const handleLogin = async () => {
  if (loginForm.username && loginForm.password) {
    loading.value = true;
    try {
      const loginSuccess = await userStore.login({
        username: loginForm.username,
        password: loginForm.password,
      });

      if (loginSuccess) {
        if (userStore.isAdmin) {
          router.push({ path: '/sys/user' });
        } else {
          router.push({ path: '/health-data' });
        }
      } else {
        errorMessage.value = '登录失败，请检查用户名或密码';
      }
    } catch (error) {
      errorMessage.value = '登录过程中发生错误，请稍后再试';
    } finally {
      loading.value = false;
    }
  } else {
    errorMessage.value = '请输入用户名和密码';
    return false;
  }
};

// 跳转到注册页
const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="login-page min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <Card
      class="max-w-md w-full space-y-8 backdrop-blur-md bg-white/90 dark:bg-gray-800/90"
      variant="solid"
      radius="medium"
      elevation="large"
      padding="large"
    >
      <div class="text-center">
        <div class="flex justify-center">
          <div
            class="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <h2 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          健康管理系统
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          欢迎回来，请登录您的账户
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <InputField
            id="username"
            v-model="loginForm.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :leftIcon="UserIcon"
            required
          />

          <InputField
            id="password"
            v-model="loginForm.password"
            name="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :leftIcon="Lock"
            required
          />
        </div>

        <!-- 错误信息显示 -->
        <div v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm mt-2">
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </div>

        <!-- 登录按钮 -->
        <div>
          <Button :disabled="loading" block>
            {{ loading ? '登录中...' : '登录' }}
          </Button>
        </div>

        <!-- 注册链接 -->
        <div class="flex items-center justify-center">
          <div class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">还没有账号？</span>
            <a href="javascript:;" @click="goToRegister"
              class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 ml-1">
              立即注册
            </a>
          </div>
        </div>
      </form>
    </Card>
  </div>
</template>

<style scoped>
.login-page {
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath opacity=".5" d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3Cpath d="M6 5V0H5v5H0v1h5v94h1V6h94V5H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'),
    linear-gradient(to right, rgb(236, 253, 245), rgb(224, 242, 254));
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
