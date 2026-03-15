<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../../services/auth';
import type { User } from '../../services/auth';
import Card from '@/components/base/Card.vue';
import Button from '@/components/base/Button.vue';
import InputField from '@/components/base/InputField.vue';
import { User as UserIcon, Lock, LockOne, Mail, Phone } from '@icon-park/vue-next';

const router = useRouter();

// 表单数据
const registerForm = reactive<User>({
  username: '',
  password: '',
  email: '',
  phone: ''
});

// 确认密码
const confirmPassword = ref('');
// 错误信息
const errorMessage = ref('');
const loading = ref(false);
// 注册成功信息
const registerSuccess = ref(false);

// 表单提交
const handleSubmit = async () => {
  // 基本表单验证
  if (!registerForm.username || !registerForm.password) {
    errorMessage.value = '用户名和密码不能为空';
    return;
  }

  if (registerForm.password !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致';
    return;
  }

  errorMessage.value = '';
  loading.value = true;

  try {
    // 调用注册API
    const response = await register(registerForm);

    // 注册成功
    registerSuccess.value = true;

    // 3秒后跳转到登录页
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (error) {
    // 显示错误信息
    errorMessage.value = error instanceof Error ? error.message : '注册失败，请检查输入信息';
  } finally {
    loading.value = false;
  }
};

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="register-page min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <h2 class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          健康管理系统
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          创建您的新账户
        </p>
      </div>

      <div v-if="registerSuccess"
        class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg relative"
        role="alert">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong class="font-bold">注册成功！</strong>
            <span class="block sm:inline ml-1">即将跳转到登录页面...</span>
          </div>
        </div>
      </div>

      <form v-else class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <InputField
            id="username"
            v-model="registerForm.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :leftIcon="UserIcon"
            required
          />

          <InputField
            id="password"
            v-model="registerForm.password"
            name="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :leftIcon="Lock"
            required
          />

          <InputField
            id="confirm-password"
            v-model="confirmPassword"
            name="confirm-password"
            type="password"
            label="确认密码"
            placeholder="请再次输入密码"
            :leftIcon="LockOne"
            required
          />

          <InputField
            id="email"
            v-model="registerForm.email"
            name="email"
            type="email"
            label="邮箱（可选）"
            placeholder="请输入邮箱"
            :leftIcon="Mail"
          />

          <InputField
            id="phone"
            v-model="registerForm.phone"
            name="phone"
            type="tel"
            label="手机号（可选）"
            placeholder="请输入手机号"
            :leftIcon="Phone"
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

        <!-- 注册按钮 -->
        <div>
          <Button :disabled="loading" block>
            {{ loading ? '注册中...' : '立即注册' }}
          </Button>
        </div>

        <!-- 登录链接 -->
        <div class="flex items-center justify-center">
          <div class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">已有账号？</span>
            <a href="javascript:;" @click="goToLogin"
              class="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 ml-1">
              立即登录
            </a>
          </div>
        </div>
      </form>
    </Card>
  </div>
</template>

<style scoped>
.register-page {
  background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath opacity=".5" d="M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z"/%3E%3Cpath d="M6 5V0H5v5H0v1h5v94h1V6h94V5H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'),
    linear-gradient(to right, rgb(236, 253, 245), rgb(224, 242, 254));
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
