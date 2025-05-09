<template>
  <div class="p-6 pt-24 bg-gray-100 min-h-screen">
    <!-- 页面标题 -->
    <div class="mb-6 bg-white p-5 rounded-lg shadow border border-gray-200">
      <h1 class="text-2xl font-semibold text-gray-800 mb-1">个人中心</h1>
      <p class="text-sm text-gray-500">管理您的个人信息、账户安全和头像设置</p>
    </div>

    <!-- 成功/错误消息 -->
    <div v-if="message" :class="[
      'mb-4 p-3 rounded-md text-sm',
      message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    ]">
      {{ message.text }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧头像卡片 -->
      <Card class="lg:col-span-1" variant="glass" radius="large" elevation="large" padding="large">
        <div class="flex flex-col items-center">
          <div class="relative">
            <div
              class="w-32 h-32 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center overflow-hidden shadow-lg">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="用户头像" class="w-full h-full object-cover" />
              <UserIcon v-else theme="filled" size="64" fill="#fff" />
            </div>
            <button @click="openAvatarUpload"
              class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-primary-dark transition">
              <Upload size="16" />
            </button>
          </div>
          <h2 class="mt-4 text-xl font-semibold text-gray-800">{{ userInfo.username || '未登录' }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ userInfo.email || '未设置邮箱' }}</p>

          <div class="mt-6 w-full">
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-sm text-gray-600">用户名</span>
              <span class="text-sm font-medium text-gray-900">{{ userInfo.username }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-sm text-gray-600">邮箱</span>
              <span class="text-sm font-medium text-gray-900">{{ userInfo.email || '未设置' }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
              <span class="text-sm text-gray-600">手机号</span>
              <span class="text-sm font-medium text-gray-900">{{ userInfo.phone || '未设置' }}</span>
            </div>
            <div class="flex items-center justify-between py-3">
              <span class="text-sm text-gray-600">账号状态</span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                正常
              </span>
            </div>
          </div>
        </div>
      </Card>

      <!-- 右侧表单卡片 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 个人资料卡片 -->
        <Card variant="solid" radius="large" elevation="medium" padding="large">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
              <UserEditIcon size="20" class="mr-2 text-primary" />
              个人资料
            </h3>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <InputField v-model="profileForm.username" :leftIcon="UserIcon" placeholder="请输入用户名"
                  :error="!!formErrors.username" :errorMessage="formErrors.username" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                <InputField v-model="profileForm.email" :leftIcon="Mail" placeholder="请输入电子邮箱"
                  :error="!!formErrors.email" :errorMessage="formErrors.email" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
                <InputField v-model="profileForm.phone" :leftIcon="Phone" placeholder="请输入手机号码"
                  :error="!!formErrors.phone" :errorMessage="formErrors.phone" />
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <Button type="primary" native-type="submit" :loading="updateLoading">
                保存修改
              </Button>
            </div>
          </form>
        </Card>

        <!-- 修改密码卡片 -->
        <Card variant="solid" radius="large" elevation="medium" padding="large">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center">
              <Lock size="20" class="mr-2 text-primary" />
              修改密码
            </h3>
          </div>

          <form @submit.prevent="updatePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
              <InputField type="password" v-model="passwordForm.oldPassword" :leftIcon="Lock" placeholder="请输入当前密码"
                :error="!!formErrors.oldPassword" :errorMessage="formErrors.oldPassword" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <InputField type="password" v-model="passwordForm.newPassword" :leftIcon="Lock" placeholder="请输入新密码"
                :error="!!formErrors.newPassword" :errorMessage="formErrors.newPassword" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
              <InputField type="password" v-model="passwordForm.confirmPassword" :leftIcon="Lock" placeholder="请再次输入新密码"
                :error="!!formErrors.confirmPassword" :errorMessage="formErrors.confirmPassword" />
            </div>

            <div class="flex justify-end pt-4">
              <Button type="primary" native-type="submit" :loading="passwordLoading">
                更新密码
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>

    <!-- 头像上传模态框 -->
    <Modal v-model="avatarDialogVisible" title="更新头像" size="md">
      <div class="space-y-4">
        <div v-if="!avatarFile" class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="handleAvatarSelect" />
          <div class="space-y-2">
            <button type="button" @click="triggerAvatarUpload"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <Upload class="mr-2" />
              选择图片
            </button>
            <p class="text-xs text-gray-500">
              支持 JPG、PNG、GIF 格式，最大 2MB
            </p>
          </div>
        </div>

        <div v-if="avatarFile && avatarPreview" class="text-center">
          <div class="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img :src="avatarPreview" alt="Avatar Preview" class="w-full h-full object-cover" />
          </div>
          <button type="button" @click="cancelAvatarUpload"
            class="mt-4 inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <Close class="mr-1" />
            取消
          </button>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t">
          <Button type="outline" @click="closeAvatarDialog">取消</Button>
          <Button type="primary" :disabled="!avatarFile" :loading="avatarUploading" @click="uploadAvatar">
            上传头像
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from '@/composables/vue-imports';
import { useUserStore } from '@/stores/user';
import api from '@/services/api';
import userManageApi from '@/services/userManage';

// 导入组件
import Button from '@/components/base/Button.vue';
import Card from '@/components/base/Card.vue';
import InputField from '@/components/base/InputField.vue';
import Modal from '@/components/base/Modal.vue';

// 导入图标
import { User as UserIcon, User as UserEditIcon, Mail, Phone, Lock, Upload, Close } from '@icon-park/vue-next';

// 获取用户仓库
const userStore = useUserStore();

// 状态
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);
const updateLoading = ref(false);
const passwordLoading = ref(false);
const avatarUploading = ref(false);
const avatarDialogVisible = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const formErrors = reactive<Record<string, string>>({});
const userDetail = ref<any>(null);

// 用户信息
const userInfo = computed(() => userDetail.value || userStore.userInfo || {});

// 表单数据
const profileForm = reactive({
  username: '',
  email: '',
  phone: ''
});

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 生命周期钩子
onMounted(async () => {
  if (userStore.token) {
    await userStore.fetchUserInfo();
    // 在获取到基本用户信息后，使用正确的接口获取详细信息
    await fetchUserDetailInfo();
  }
});

// 当userInfo更新时，重新填充表单
// 这确保了即使userInfo异步加载，表单也会正确更新
watch(() => userStore.userInfo, (newValue: any) => {
  if (newValue && newValue.id) {
    fetchUserDetailInfo();
  }
}, { deep: true });

// 方法
const resetProfileForm = () => {
  if (userStore.userInfo) {
    profileForm.username = userStore.userInfo.username || '';
    profileForm.email = userStore.userInfo.email || '';
    profileForm.phone = userStore.userInfo.phone || '';
  }
};

// 获取用户详细信息
const fetchUserDetailInfo = async () => {
  if (!userStore.userInfo || !userStore.userInfo.id) return;

  try {
    const response = await userManageApi.getUserById(userStore.userInfo.id);
    // 使用获取到的详细信息更新表单
    userDetail.value = response.data;

    profileForm.username = userDetail.value.username || '';
    profileForm.email = userDetail.value.email || '';
    profileForm.phone = userDetail.value.phone || '';

    // 可以在此处更新其他您想要显示的用户详细信息
    console.log('获取到用户详细信息:', userDetail.value);
  } catch (error) {
    console.error('获取用户详细信息失败:', error);
    // 如果获取详细信息失败，仍使用store中的基本信息
    resetProfileForm();
  }
};

// 基础验证
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

// 更新个人资料
const updateProfile = async () => {
  formErrors.username = '';
  formErrors.email = '';
  formErrors.phone = '';

  let isValid = true;

  if (!profileForm.username || profileForm.username.length < 2) {
    formErrors.username = '用户名至少需要2个字符';
    isValid = false;
  }

  if (profileForm.email && !validateEmail(profileForm.email)) {
    formErrors.email = '请输入有效的电子邮箱';
    isValid = false;
  }

  if (profileForm.phone && !validatePhone(profileForm.phone)) {
    formErrors.phone = '请输入有效的手机号码';
    isValid = false;
  }

  if (!isValid) return;

  updateLoading.value = true;
  message.value = null;

  try {
    // 准备更新数据
    const updateData = {
      id: userStore.userInfo?.id,
      username: profileForm.username,
      email: profileForm.email,
      phone: profileForm.phone
    };

    // 调用API更新
    const response = await userManageApi.updateUser(updateData);

    message.value = { type: 'success', text: '个人资料已更新' };
    // 刷新用户信息
    await userStore.fetchUserInfo();
  } catch (error) {
    console.error('更新个人资料失败:', error);
    message.value = { type: 'error', text: '更新个人资料失败，请稍后再试' };
  } finally {
    updateLoading.value = false;
  }
};

// 更新密码
const updatePassword = async () => {
  formErrors.oldPassword = '';
  formErrors.newPassword = '';
  formErrors.confirmPassword = '';

  let isValid = true;

  if (!passwordForm.oldPassword) {
    formErrors.oldPassword = '请输入当前密码';
    isValid = false;
  }

  if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
    formErrors.newPassword = '新密码至少需要6个字符';
    isValid = false;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    formErrors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  if (!isValid) return;

  passwordLoading.value = true;
  message.value = null;

  try {
    // 调用API更新密码
    const response = await userManageApi.changePassword({
      id: userStore.userInfo?.id,
      newPassword: passwordForm.newPassword
    });

    message.value = { type: 'success', text: '密码已更新，请使用新密码登录' };

    // 清空密码表单
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';

    // 可以选择登出用户，要求重新登录
    // await userStore.logout();
    // router.push('/login');
  } catch (error) {
    console.error('更新密码失败:', error);
    message.value = { type: 'error', text: '更新密码失败，请确认当前密码是否正确' };
  } finally {
    passwordLoading.value = false;
  }
};

// 头像上传相关
const openAvatarUpload = () => {
  avatarDialogVisible.value = true;
  avatarFile.value = null;
  avatarPreview.value = null;
};

const closeAvatarDialog = () => {
  avatarDialogVisible.value = false;
  avatarFile.value = null;
  avatarPreview.value = null;
};

const triggerAvatarUpload = () => {
  if (avatarInput.value) {
    avatarInput.value.click();
  }
};

const handleAvatarSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    avatarFile.value = input.files[0];

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(avatarFile.value);
  }
};

const cancelAvatarUpload = () => {
  avatarFile.value = null;
  avatarPreview.value = null;
  if (avatarInput.value) {
    avatarInput.value.value = '';
  }
};

const uploadAvatar = async () => {
  if (!avatarFile.value) return;

  avatarUploading.value = true;
  message.value = null;

  try {
    const formData = new FormData();
    formData.append('file', avatarFile.value);

    // 上传头像
    const response = await api.post('/file/user/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // 获取返回的头像URL
    const avatarUrl = response.data.url;

    // 确保有用户ID和头像URL
    if (avatarUrl && userDetail.value && userDetail.value.id) {
      const userId = userDetail.value.id;

      // 使用updateUser API更新用户头像，避免额外的updateAvatar请求
      await userManageApi.updateUser({
        id: userId,
        username: userDetail.value.username, // 必须提供username字段
        avatar: avatarUrl
      });

      // 刷新用户详细信息
      await fetchUserDetailInfo();

      message.value = { type: 'success', text: '头像已更新' };
      closeAvatarDialog();
    } else {
      throw new Error('缺少用户ID或头像URL');
    }
  } catch (error) {
    console.error('上传头像失败:', error);
    message.value = { type: 'error', text: '上传头像失败，请稍后再试' };
  } finally {
    avatarUploading.value = false;
  }
};
</script>

<style scoped>
/* 可以添加额外的组件样式 */
</style>
