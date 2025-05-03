<template>
  <div class="p-4 md:p-6 bg-gray-100 min-h-screen">
    <!-- Page Header -->
    <div class="mb-6 bg-white p-5 rounded-lg shadow border border-gray-200">
      <h1 class="text-2xl font-semibold text-gray-800 mb-1">用户管理</h1>
      <p class="text-sm text-gray-500">管理系统用户信息，包括用户添加、编辑、删除及权限分配</p>
    </div>

    <!-- Search Card -->
    <Card class="mb-6" variant="solid">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-grow flex flex-wrap gap-4 items-center">
          <InputField
            v-model="searchModel.username"
            placeholder="按用户名搜索"
            :leftIcon="UserIcon"
            class="w-full sm:w-auto flex-grow sm:flex-grow-0 min-w-[200px]"
          />
          <InputField
            v-model="searchModel.phone"
            placeholder="按手机号搜索"
            :leftIcon="Iphone"
            class="w-full sm:w-auto flex-grow sm:flex-grow-0 min-w-[200px]"
          />
          <Button @click="getUserList" type="primary" :icon="Search" :disabled="listLoading">查询</Button>
          <Button @click="resetSearch" type="outline" :icon="Refresh" :disabled="listLoading">重置</Button>
        </div>
        <div class="flex-shrink-0">
          <Button @click="openDialog(null)" type="success" :icon="Plus">新增用户</Button>
          </div>
      </div>
    </Card>

    <!-- Success/Error Messages -->
    <div v-if="saveMessage" :class="[
        'mb-4 p-3 rounded-md text-sm',
        saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        ]">
        {{ saveMessage.text }}
    </div>

    <!-- User List Card -->
    <Card variant="solid">
        <div class="flex justify-between items-center mb-4">
            <span class="text-base font-medium text-gray-700">用户信息列表</span>
            <span class="text-sm text-gray-500">共 {{ total }} 条记录</span>
        </div>

        <!-- Loading Indicator -->
        <div v-if="listLoading" class="text-center py-10 text-gray-500">
            <p>数据加载中...</p>
        </div>

        <!-- User Table (Custom Implementation) -->
        <div v-else-if="userList.length > 0" class="overflow-x-auto">
            <div class="min-w-full divide-y divide-gray-200">
                <!-- Table Header -->
                <div class="bg-gray-50 hidden md:flex">
                    <div class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 text-center">序号</div>
                    <div class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 text-center">ID</div>
                    <div class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1 min-w-[120px]">用户名</div>
                    <div class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1 min-w-[140px]">电话</div>
                    <div class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1 min-w-[180px]">邮箱</div>
                    <div class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex-1 min-w-[150px]">角色</div>
                    <div class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">操作</div>
                </div>
                <!-- Table Body -->
                <div class="bg-white divide-y divide-gray-200">
                    <div v-for="(user, index) in userList" :key="user.id" class="flex flex-col md:flex-row hover:bg-gray-50 items-start md:items-center">
                        <div class="px-4 py-3 w-full md:w-16 text-center text-sm text-gray-500 md:text-gray-900"><span class="font-bold md:hidden">序号: </span>{{ index + 1 + (searchModel.pageNo - 1) * searchModel.pageSize }}</div>
                        <div class="px-4 py-3 w-full md:w-20 text-center text-sm text-gray-500 md:text-gray-900"><span class="font-bold md:hidden">ID: </span>{{ user.id }}</div>
                        <div class="px-4 py-3 flex-1 min-w-[120px] text-sm font-medium text-primary"><span class="font-bold md:hidden text-gray-500">用户名: </span>{{ user.username }}</div>
                        <div class="px-4 py-3 flex-1 min-w-[140px] text-sm text-gray-700"><span class="font-bold md:hidden text-gray-500">电话: </span>
                             <span v-if="user.phone" class="flex items-center"><Iphone class="w-4 h-4 mr-1 inline-block text-gray-400"/> {{ user.phone }}</span>
                             <span v-else class="text-gray-400 text-xs italic">未设置</span>
                        </div>
                        <div class="px-4 py-3 flex-1 min-w-[180px] text-sm text-gray-700"><span class="font-bold md:hidden text-gray-500">邮箱: </span>
                            <span v-if="user.email" class="flex items-center"><Message class="w-4 h-4 mr-1 inline-block text-gray-400"/> {{ user.email }}</span>
                            <span v-else class="text-gray-400 text-xs italic">未设置</span>
                        </div>
                        <div class="px-4 py-3 flex-1 min-w-[150px] text-sm text-gray-700"><span class="font-bold md:hidden text-gray-500">角色: </span>
                           <span class="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">{{ getRoleNames(user.roleIdList) }}</span>
                        </div>
                        <div class="px-4 py-3 w-full md:w-32 text-center space-x-2">
                            <Button @click="openDialog(user.id)" type="secondary" size="small" :icon="Edit" iconOnly title="编辑"></Button>
                            <Button @click="deleteUser(user)" type="danger" size="small" :icon="Delete" iconOnly title="删除"></Button>
                             <!-- Add Change Password Button if needed -->
                        </div>
                    </div>
                </div>
            </div>
      </div>

        <!-- Empty State -->
        <div v-else class="text-center py-10 text-gray-500">
            <p>暂无用户数据</p>
            <Button @click="openDialog(null)" type="primary" class="mt-4">立即添加</Button>
        </div>

        <!-- Pagination -->
        <div v-if="total > 0" class="mt-6 flex justify-between items-center">
            <span class="text-sm text-gray-600">共 {{ total }} 条记录</span>
            <div class="flex items-center space-x-2">
                <Button @click="goToPage(searchModel.pageNo - 1)" type="outline" size="small" :icon="Left" :disabled="searchModel.pageNo <= 1">上一页</Button>
                <span class="text-sm text-gray-700">第 {{ searchModel.pageNo }} / {{ totalPages }} 页</span>
                <Button @click="goToPage(searchModel.pageNo + 1)" type="outline" size="small" :icon="Right" :disabled="searchModel.pageNo >= totalPages">下一页</Button>
            </div>
        </div>
    </Card>

    <!-- Add/Edit User Modal -->
    <div v-if="dialogFormVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card class="w-full max-w-lg bg-white" variant="solid" elevation="large">
        <div class="flex justify-between items-center mb-4 border-b pb-3">
          <h3 class="text-lg font-semibold text-gray-800">{{ dialogTitle }}</h3>
          <Button @click="closeDialog" type="text" :icon="Close" iconOnly size="small" title="关闭"></Button>
        </div>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名 <span class="text-red-500">*</span></label>
            <InputField
              v-model="userForm.username"
              placeholder="请输入用户名 (2-20字符)"
              :leftIcon="UserIcon"
              :error="!!formErrors.username"
              :errorMessage="formErrors.username"
              @update:modelValue="formErrors.username = ''"
            />
          </div>

          <div v-if="!isEditMode">
            <label class="block text-sm font-medium text-gray-700 mb-1">密码 <span class="text-red-500">*</span></label>
            <InputField
            type="password"
            v-model="userForm.password"
              placeholder="请输入密码 (6-20字符)"
              :leftIcon="Lock"
              :error="!!formErrors.password"
              :errorMessage="formErrors.password"
               @update:modelValue="formErrors.password = ''"
            />
            <!-- Basic password strength indicator could be added here if needed -->
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
            <InputField
            v-model="userForm.phone"
              placeholder="请输入手机号码 (选填)"
              :leftIcon="Iphone"
              :error="!!formErrors.phone"
              :errorMessage="formErrors.phone"
              @update:modelValue="formErrors.phone = ''"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">电子邮件</label>
             <InputField
            v-model="userForm.email"
              placeholder="请输入电子邮箱地址 (选填)"
              :leftIcon="Message"
              :error="!!formErrors.email"
              :errorMessage="formErrors.email"
              @update:modelValue="formErrors.email = ''"
            />
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">用户角色 <span class="text-red-500">*</span></label>
             <!-- Basic Multi-Select using Checkboxes -->
             <div class="border rounded-md p-2 max-h-40 overflow-y-auto">
                 <div v-if="allRoleList.length > 0">
                     <label v-for="role in allRoleList" :key="role.roleId" class="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                        <input type="checkbox" :value="role.roleId" v-model="userForm.roleIdList" class="rounded border-gray-300 text-primary focus:ring-primary">
                        <span>{{ role.roleName }} ({{ role.roleDesc }})</span>
                    </label>
                 </div>
                 <p v-else class="text-xs text-gray-500">没有可用的角色</p>
             </div>
             <p v-if="formErrors.roleIdList" class="text-xs text-red-500 mt-1">{{ formErrors.roleIdList }}</p>
          </div>

           <div v-if="!isEditMode" class="text-xs text-gray-500 flex items-center">
               <Info class="w-4 h-4 mr-1 text-blue-500"/>
               <span>用户创建后，可通过"修改密码"功能重置密码 (需另行实现)</span>
           </div>

          <!-- Save/Cancel Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t mt-6">
            <Button type="outline" @click="closeDialog">取消</Button>
            <Button type="primary" native-type="submit" :loading="saveLoading">确定</Button>
        </div>
        </form>
      </Card>
      </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import userApi from "@/services/userManage";
import roleApi from "@/services/roleManage";
import type { User } from '@/types/user';
import type { Role } from '@/types/role';

// Import custom base components
import Button from '@/components/base/Button.vue';
import Card from '@/components/base/Card.vue';
import InputField from '@/components/base/InputField.vue';

// Import Icons from IconPark
import { Search, Refresh, Plus, User as UserIcon, Iphone, Message, Edit, Delete, Lock, Info, Close, Left, Right } from '@icon-park/vue-next';

// --- Reactive State ---
const searchModel = reactive({
  username: '',
  phone: '',
  pageNo: 1,
  pageSize: 10, // Default page size
});

const listLoading = ref(false);
const userList = ref<User[]>([]);
const total = ref(0);

const dialogFormVisible = ref(false);
const saveLoading = ref(false);
const isEditMode = ref(false); // Track if dialog is for editing
const userForm = reactive<Partial<User>>({
  id: undefined,
  username: '',
  password: '',
  phone: '',
  email: '',
  roleIdList: [],
});
const formErrors = reactive<Record<string, string>>({}); // For basic validation messages
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

const allRoleList = ref<Role[]>([]);

// --- Computed Properties ---
const totalPages = computed(() => {
  return Math.ceil(total.value / searchModel.pageSize);
});

const dialogTitle = computed(() => (isEditMode.value ? '编辑用户' : '新增用户'));

// --- Validation Logic (Basic) ---
const phoneReg = /^1[3-9]\d{9}$/;
const emailReg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

const validateForm = (): boolean => {
  let isValid = true;
  formErrors.username = '';
  formErrors.password = '';
  formErrors.email = '';
  formErrors.phone = '';
  formErrors.roleIdList = '';

  if (!userForm.username || userForm.username.length < 2 || userForm.username.length > 20) {
    formErrors.username = '用户名长度需在 2 到 20 个字符';
    isValid = false;
  }
  if (!isEditMode.value && (!userForm.password || userForm.password.length < 6 || userForm.password.length > 20)) {
    formErrors.password = '密码长度需在 6 到 20 个字符';
    isValid = false;
  }
  if (userForm.email && !emailReg.test(userForm.email)) {
    formErrors.email = '请输入有效的邮箱地址';
    isValid = false;
  }
  if (userForm.phone && !phoneReg.test(userForm.phone)) {
    formErrors.phone = '请输入有效的手机号';
    isValid = false;
  }
  if (!userForm.roleIdList || userForm.roleIdList.length === 0) {
    formErrors.roleIdList = '请至少选择一个角色';
    isValid = false;
  }
  return isValid;
};

const clearFormErrors = () => {
  Object.keys(formErrors).forEach(key => formErrors[key] = '');
  saveMessage.value = null;
};

// --- Methods ---
const getUserList = async () => {
  listLoading.value = true;
  saveMessage.value = null; // Clear previous messages
  try {
    const response = await userApi.getUserList(searchModel);
    if (response && response.data) {
      userList.value = response.data.rows;
      total.value = response.data.total;
    } else {
      userList.value = [];
      total.value = 0;
      saveMessage.value = { type: 'error', text: '获取用户列表失败: 无效响应' };
    }
  } catch (error) {
    console.error("Error fetching user list:", error);
    userList.value = [];
    total.value = 0;
    saveMessage.value = { type: 'error', text: `获取用户列表失败: ${error instanceof Error ? error.message : '未知错误'}` };
  } finally {
    listLoading.value = false;
  }
};

const getAllRoles = async () => {
  try {
    const response = await roleApi.getAllRoles();
    if (response && Array.isArray(response.data)) { // Adjust check based on actual API response
      allRoleList.value = response.data;
    } else {
      console.error("Invalid response structure from getAllRoles:", response);
      allRoleList.value = [];
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
    saveMessage.value = { type: 'error', text: '获取角色列表失败' };
  }
};

const resetSearch = () => {
  searchModel.username = '';
  searchModel.phone = '';
  searchModel.pageNo = 1;
  getUserList();
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
      searchModel.pageNo = page;
      getUserList();
  }
};

const openDialog = async (id: number | null | undefined) => {
  clearFormErrors();
  await getAllRoles(); // Load roles first

  if (id) {
    isEditMode.value = true;
    try {
      const response = await userApi.getUserById(id);
      if (response && response.data) {
        Object.assign(userForm, response.data);
        userForm.password = ''; // Don't show password in edit mode
        userForm.roleIdList = response.data.roleIdList || [];
      } else {
        saveMessage.value = { type: 'error', text: '获取用户信息失败' };
        return;
      }
      } catch (error) {
      console.error("Error fetching user by ID:", error);
      saveMessage.value = { type: 'error', text: '获取用户信息失败' };
      return;
    }
  } else {
    isEditMode.value = false;
    Object.assign(userForm, {
      id: undefined, username: '', password: '', phone: '', email: '', roleIdList: [],
    });
  }
  dialogFormVisible.value = true;
};

const closeDialog = () => {
  dialogFormVisible.value = false;
  clearFormErrors();
};

const saveUser = async () => {
  clearFormErrors();
  if (!validateForm()) {
    return;
  }

  saveLoading.value = true;
  saveMessage.value = null;
  try {
    let result: any;
    if (isEditMode.value) {
      // Don't send password on update if it wasn't meant to be changed
      const { password, ...updateData } = userForm;
      result = await userApi.updateUser(updateData as User);
        } else {
      const { id, ...addData } = userForm;
      result = await userApi.addUser(addData);
    }

    if (result && result.code === 20000) {
      saveMessage.value = { type: 'success', text: isEditMode.value ? '用户更新成功' : '用户添加成功' };
      closeDialog();
      await getUserList(); // Refresh list
        } else {
      saveMessage.value = { type: 'error', text: result?.message || (isEditMode.value ? '更新失败' : '添加失败') };
        }
  } catch (error) {
    console.error("Save user error:", error);
    saveMessage.value = { type: 'error', text: `操作失败: ${error instanceof Error ? error.message : '未知错误'}` };
      } finally {
    saveLoading.value = false;
  }
};

const deleteUser = async (user: User) => {
  if (window.confirm(`您确定要删除用户【${user.username}】吗？`)) {
    listLoading.value = true; // Indicate loading state for delete
    saveMessage.value = null;
    try {
      const result = await userApi.deleteUser(user.id); // Use deleteUser, not deleteUserById
      if (result && result.code === 20000) {
        saveMessage.value = { type: 'success', text: '用户删除成功' };
        // Adjust page number if the last item on a page was deleted
        if (userList.value.length === 1 && searchModel.pageNo > 1) {
          searchModel.pageNo--;
        }
        await getUserList(); // Refresh list
      } else {
        saveMessage.value = { type: 'error', text: result?.message || '删除失败' };
      }
    } catch (error) {
      console.error("Delete user error:", error);
      saveMessage.value = { type: 'error', text: `删除用户时出错: ${error instanceof Error ? error.message : '未知错误'}` };
        } finally {
      listLoading.value = false;
    }
  }
};

// Helper to get role names for display
const getRoleNames = (roleIdList: number[] | undefined): string => {
    if (!roleIdList || roleIdList.length === 0) return '未分配角色';
    return allRoleList.value
        .filter(role => roleIdList.includes(role.roleId))
        .map(role => role.roleName)
        .join(', ') || '未知角色';
};

// --- Lifecycle Hooks ---
onMounted(() => {
  getUserList();
  getAllRoles(); // Fetch roles initially
});
</script>

<style scoped>
/* Basic scoped styles - Tailwind handles most styling */
.password-strength-indicator span {
    display: inline-block;
    width: 30px;
    height: 5px;
    margin-right: 2px;
    border-radius: 2px;
    background-color: #eee;
}
.password-strength-indicator .strength-weak {
    background-color: #F56C6C;
}
.password-strength-indicator .strength-medium {
    background-color: #E6A23C;
}
.password-strength-indicator .strength-strong {
    background-color: #67C23A;
}
/* Add more specific styles if needed */
</style>
