<template>
  <div
    class="p-4 sm:p-6 lg:p-8 space-y-6 relative bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-60px)] mt-[60px] pt-24">
    <!-- 页面标题区 - 修改为与health-knowledge.vue一致 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">健康数据日志</h1>
        <p class="mt-3 text-xl text-gray-500 dark:text-gray-400">全面管理并回顾您的健康信息记录</p>
      </div>
    </div>

    <!-- 搜索与操作区 - 响应式宽度 -->
    <div class="max-w-7xl w-full mx-auto">
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 p-6">
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
          <SearchField v-model="searchKeyword" placeholder="输入姓名、手机号等关键字搜索..." class="w-full md:w-1/2 lg:w-1/3"
            @search="handleSearch" @clear="handleClearSearch" />
          <Button type="primary" :icon="Plus" @click="openAddDialog" class="w-full md:w-auto">添加记录</Button>
        </div>
      </div>

      <!-- 数据表格 - 响应式宽度 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mt-8 p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  序号</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  姓名</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  上传时间</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  年龄</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  性别</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  身高 (cm)</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  体重 (kg)</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  心率 (次/分)</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  睡眠时长 (h)</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  睡眠质量</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  吸烟</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  饮酒</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  运动</th>
                <th scope="col"
                  class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td :colspan="14" class="p-0">
                  <div class="p-4">
                    <!-- 添加骨架屏 -->
                    <div v-for="i in 5" :key="i" class="animate-pulse flex space-x-4 mb-4">
                      <div class="h-4 bg-gray-200 rounded w-1/12"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/6"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/12"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/12"></div>
                      <div class="h-4 bg-gray-200 rounded w-1/12"></div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="logList.length === 0">
                <td :colspan="14" class="p-0">
                  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <Empty theme="outline" size="64" class="text-gray-300 mb-4" />
                    <p class="text-gray-500 mb-2 text-lg">暂无健康日志数据</p>
                    <p class="text-gray-400 text-sm mb-6">点击"添加记录"按钮开始记录您的健康数据</p>
                    <Button type="primary" :icon="Plus" @click="openAddDialog">添加第一条记录</Button>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="(item, index) in logList" :key="item.notesid"
                class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{{ (pagination.pageNo - 1) *
                  pagination.pageSize + index + 1 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{{ item.name }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(item.date) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.age !== null && item.age !==
                  undefined ? item.age : '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span class="flex items-center">
                    <Male v-if="item.gender === '男'" theme="outline" size="16" class="mr-1 text-blue-500" />
                    <Female v-else-if="item.gender === '女'" theme="outline" size="16" class="mr-1 text-pink-500" />
                    {{ item.gender }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.height !== null && item.height
                  !== undefined ? item.height : '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.weight !== null && item.weight
                  !== undefined ? item.weight : '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.heartRate !== null &&
                  item.heartRate !== undefined ? item.heartRate : '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.sleepDuration !== null &&
                  item.sleepDuration !== undefined ? item.sleepDuration : '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm">
                  <span :class="getSleepQualityClass(item.sleepQuality)">
                    {{ formatSleepQuality(item.sleepQuality) }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm">
                  <span :class="getBooleanTagClass(item.smoking)">
                    {{ item.smoking ? '是' : '否' }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm">
                  <span :class="getBooleanTagClass(item.drinking)">
                    {{ item.drinking ? '是' : '否' }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm">
                  <span :class="getBooleanTagClass(!item.exercise, true)">
                    {{ item.exercise ? '是' : '否' }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center space-x-2">
                    <Button type="text" :icon="Edit" size="small" @click="openEditDialog(item)" aria-label="编辑"
                      class="text-gray-500 hover:text-primary transition-colors">
                    </Button>
                    <Button type="text" :icon="Delete" size="small"
                      class="text-gray-500 hover:text-red-500 transition-colors" @click="handleDelete(item)"
                      aria-label="删除"></Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0"
          class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 py-3 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            共 <span class="font-medium text-gray-800">{{ total }}</span> 条记录
          </p>
          <div class="flex justify-center sm:justify-end">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm" aria-label="分页">
              <button @click="changePage(pagination.pageNo - 1)" :disabled="pagination.pageNo <= 1"
                class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span class="sr-only">上一页</span>
                &laquo;
              </button>
              <button v-for="page in displayedPages" :key="page" @click="changePage(page)" :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium transition-colors',
                pagination.pageNo === page ? 'z-10 bg-primary-light bg-opacity-20 text-primary border-primary-light' : 'text-gray-500 hover:bg-gray-50'
              ]">
                {{ page }}
              </button>
              <button @click="changePage(pagination.pageNo + 1)" :disabled="pagination.pageNo >= totalPages"
                class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span class="sr-only">下一页</span>
                &raquo;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗 - 修改背景为半透明 -->
    <Transition name="fade">
      <div v-if="dialogVisible"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-2xl" @click.stop>
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 p-4">
            <h2 class="text-lg font-semibold text-gray-800">{{ dialogTitle }}</h2>
            <Button type="text" :icon="Close" @click="closeDialog" aria-label="关闭"
              class="text-gray-500 hover:text-gray-700"></Button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6 max-h-[70vh] overflow-y-auto p-4">
            <!-- 表单内容 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <!-- 基本信息 -->
              <div class="lg:col-span-3 p-3 bg-blue-50 rounded-lg mb-2">
                <h3 class="text-sm font-medium text-blue-800 mb-3">基本信息</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField v-model="logForm.name" label="姓名" placeholder="请输入姓名" :error="!!errors.name"
                    :errorMessage="errors.name" required />
                  <InputField v-model.number="logForm.age" type="number" label="年龄" placeholder="请输入年龄"
                    :error="!!errors.age" :errorMessage="errors.age" required />
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">性别 <span
                        class="text-red-500">*</span></label>
                    <select v-model="logForm.gender" required
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm">
                      <option value="男">男</option>
                      <option value="女">女</option>
                      <option value="其他">其他</option>
                    </select>
                    <p v-if="errors.gender" class="mt-1 text-xs text-red-600">{{ errors.gender }}</p>
                  </div>
                </div>
              </div>

              <!-- 身体指标 - 添加文字描述 -->
              <div class="lg:col-span-3 p-3 bg-green-50 rounded-lg mb-2">
                <h3 class="text-sm font-medium text-green-800 mb-3">身体指标</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <InputField v-model.number="logForm.height" type="number" step="0.1" label="身高 (cm)"
                      placeholder="请输入身高" :error="!!errors.height" :errorMessage="errors.height" required />
                    <p class="text-xs text-gray-500 mt-1">正常成人身高范围：150-200cm</p>
                  </div>
                  <div>
                    <InputField v-model.number="logForm.weight" type="number" step="0.1" label="体重 (kg)"
                      placeholder="请输入体重" :error="!!errors.weight" :errorMessage="errors.weight" required />
                    <p class="text-xs text-gray-500 mt-1">体重标准：BMI指数18.5-24.9</p>
                  </div>
                  <div>
                    <InputField v-model.number="logForm.heartRate" type="number" label="心率 (次/分)"
                      placeholder="例如: 75" />
                    <p class="text-xs text-gray-500 mt-1">正常心率范围：60-100次/分</p>
                  </div>
                  <div>
                    <InputField v-model="logForm.bloodPressure" label="血压" placeholder="例如: 120/80 mmHg" />
                    <p class="text-xs text-gray-500 mt-1">正常血压：120/80 mmHg</p>
                  </div>
                  <div>
                    <InputField v-model="logForm.bloodSugar" label="血糖" placeholder="例如: 5.5 mmol/L" />
                    <p class="text-xs text-gray-500 mt-1">空腹血糖：3.9-6.1 mmol/L</p>
                  </div>
                  <div>
                    <InputField v-model="logForm.bloodLipid" label="血脂" placeholder="例如: 正常/偏高" />
                    <p class="text-xs text-gray-500 mt-1">总胆固醇应低于5.2 mmol/L</p>
                  </div>
                </div>
              </div>

              <!-- 生活习惯 -->
              <div class="lg:col-span-3 p-3 bg-yellow-50 rounded-lg">
                <h3 class="text-sm font-medium text-yellow-800 mb-3">生活习惯</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <InputField v-model.number="logForm.sleepDuration" type="number" step="0.5" label="睡眠时长 (h)"
                      placeholder="例如: 8" />
                    <p class="text-xs text-gray-500 mt-1">成人推荐睡眠：7-9小时/天</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">睡眠质量</label>
                    <div class="flex space-x-4 mt-2">
                      <label v-for="q in sleepQualityOptions" :key="q.value"
                        class="inline-flex items-center cursor-pointer">
                        <input type="radio" class="form-radio text-primary focus:ring-primary border-gray-300 rounded"
                          v-model.number="logForm.sleepQuality" :value="q.value">
                        <span class="ml-2 text-sm text-gray-700">{{ q.label }}</span>
                      </label>
                    </div>
                    <p v-if="errors.sleepQuality" class="mt-1 text-xs text-red-600">{{ errors.sleepQuality }}</p>
                  </div>
                  <div>
                    <InputField v-model.number="logForm.waterConsumption" type="number" label="饮水量 (ml)"
                      placeholder="例如: 1500" />
                    <p class="text-xs text-gray-500 mt-1">建议：1500-2000ml/天</p>
                  </div>

                  <div class="flex items-center space-x-4">
                    <label class="text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center">
                      <input type="checkbox" v-model="logForm.smoking"
                        class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary">
                      <span class="ml-2">吸烟</span>
                    </label>
                  </div>
                  <div class="flex items-center space-x-4">
                    <label class="text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center">
                      <input type="checkbox" v-model="logForm.drinking"
                        class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary">
                      <span class="ml-2">饮酒</span>
                    </label>
                  </div>
                  <div class="flex items-center space-x-4">
                    <label class="text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center">
                      <input type="checkbox" v-model="logForm.exercise"
                        class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary">
                      <span class="ml-2">规律运动</span>
                    </label>
                  </div>

                  <div class="lg:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">喜好食物 (可多选)</label>
                    <!-- 改进的多选组件 -->
                    <div class="mt-1 flex flex-wrap gap-2">
                      <label v-for="food in foodOptions" :key="food.value"
                        class="inline-flex items-center px-3 py-1.5 rounded-full border cursor-pointer select-none text-sm transition-colors"
                        :class="logForm.foodTypes && logForm.foodTypes.includes(food.value) ? 'bg-primary-light text-primary border-primary' : 'border-gray-300 text-gray-700'">
                        <input type="checkbox" :value="food.value" v-model="logForm.foodTypes" class="hidden">
                        {{ food.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 按钮 -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
              <Button type="outline" @click="closeDialog">取消</Button>
              <Button type="primary" native-type="submit" :disabled="isSubmitting">
                <LoadingOne v-if="isSubmitting" theme="outline" size="18" :spin="true" class="mr-2" />
                {{ isSubmitting ? '提交中...' : '确定' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- 确认提示 - 修改背景为半透明 -->
    <Transition name="fade">
      <div v-if="confirmVisible"
        class="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-sm bg-white rounded-lg shadow-2xl" @click.stop>
          <div class="text-center p-6">
            <div class="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
              <Delete theme="outline" size="24" class="text-red-500" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">{{ confirmMessage }}</h3>
            <p class="text-sm text-gray-500 mb-6">此操作无法撤销，请确认是否继续？</p>
          </div>
          <div class="flex justify-center space-x-3 p-4 border-t border-gray-200">
            <Button type="outline" @click="cancelConfirm" class="w-full">取消</Button>
            <Button type="danger" @click="executeConfirm" :disabled="isDeleting" class="w-full">
              <LoadingOne v-if="isDeleting" theme="outline" size="18" :spin="true" class="mr-2" />
              {{ isDeleting ? '删除中...' : '确定删除' }}
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 通知组件 -->
    <Transition name="slide-fade">
      <div v-if="notification.visible"
        :class="['fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg text-sm max-w-sm', notificationClasses]">
        <div class="flex items-center justify-between">
          <span class="flex items-center">
            <component :is="notificationIcon" theme="outline" size="18" class="mr-2" />
            {{ notification.message }}
          </span>
          <button @click="hideNotification" class="ml-4 flex-shrink-0">
            <Close theme="outline" size="16" class="text-current opacity-70 hover:opacity-100" />
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
// Corrected: Component name should be multi-word
// @ts-expect-error Vue 3.x型声明文件兼容性问题
import { ref, reactive, onMounted, computed } from 'vue';
import Button from '@/components/base/Button.vue';
import InputField from '@/components/base/InputField.vue';
import SearchField from '@/components/base/SearchField.vue';
import { Plus, Edit, Delete, Close, LoadingOne, Empty, Male, Female, CheckSmall, CloseSmall, Info } from '@icon-park/vue-next'; // Added icons for notification
import * as healthApi from '@/services/health'; // Corrected import: Use named import
import type { BodyNotes } from '@/types/health'; // 假设类型定义在 types/health.ts

// State
const loading = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const logList = ref<BodyNotes[]>([]);
const total = ref(0);
const searchKeyword = ref('');
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
});
const dialogVisible = ref(false);
const dialogTitle = ref('');
const logForm = ref<Partial<BodyNotes>>({}); // Use Partial for flexibility
const errors = reactive<Record<string, string>>({});

const confirmVisible = ref(false);
const confirmMessage = ref('');
let confirmAction: (() => Promise<void>) | null = null;

// Notification State
const notification = reactive({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'warning',
});
let notificationTimeout: ReturnType<typeof setTimeout> | null = null;

const defaultLogForm: Partial<BodyNotes> = {
  name: '',
  age: null,
  gender: '男',
  height: null,
  weight: null,
  bloodSugar: '',
  bloodPressure: '',
  bloodLipid: '',
  heartRate: null,
  vision: '',
  sleepDuration: null,
  sleepQuality: 2, // 默认一般
  smoking: false,
  drinking: false,
  exercise: false,
  foodTypes: [],
  waterConsumption: null,
  date: null,
};

const sleepQualityOptions = [
  { value: 1, label: '好' },
  { value: 2, label: '一般' },
  { value: 3, label: '差' },
];

// 添加食物选项数据
const foodOptions = [
  { value: '蔬菜', label: '蔬菜' },
  { value: '水果', label: '水果' },
  { value: '肉类', label: '肉类' },
  { value: '鱼类', label: '鱼类' },
  { value: '豆类', label: '豆类' },
  { value: '谷物', label: '谷物' },
  { value: '其他', label: '其他' },
];

// Computed
const totalPages = computed(() => Math.ceil(total.value / pagination.pageSize));

// 添加分页显示逻辑
const displayedPages = computed(() => {
  const pageNumbers = [];
  let startPage = Math.max(1, pagination.pageNo - 2);
  const endPage = Math.min(totalPages.value, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
});

// Notification Computed Classes
const notificationClasses = computed(() => {
  switch (notification.type) {
    case 'success':
      return 'bg-green-50 border border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
    default:
      return 'bg-gray-50 border border-gray-200 text-gray-800';
  }
});

const notificationIcon = computed(() => {
  switch (notification.type) {
    case 'success': return CheckSmall;
    case 'error': return CloseSmall;
    case 'warning': return Info;
    default: return Info;
  }
});

// Methods
// Notification Methods
const showNotification = (type: 'success' | 'error' | 'warning', message: string, duration: number = 3000) => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
  notification.type = type;
  notification.message = message;
  notification.visible = true;
  notificationTimeout = setTimeout(() => {
    hideNotification();
  }, duration);
};

const hideNotification = () => {
  notification.visible = false;
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
};

const fetchLogList = async () => {
  loading.value = true;
  try {
    const params = {
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize,
    };
    const responsePayload = await healthApi.getUserBodyList(params);

    if (responsePayload && Array.isArray(responsePayload.rows) && typeof responsePayload.total === 'number') {
      logList.value = responsePayload.rows;
      total.value = responsePayload.total;
    } else if (responsePayload && Array.isArray(responsePayload.list) && typeof responsePayload.total === 'number') {
      logList.value = responsePayload.list;
      total.value = responsePayload.total;
    } else if (responsePayload && Array.isArray(responsePayload.records) && typeof responsePayload.totalRecords === 'number') {
      logList.value = responsePayload.records;
      total.value = responsePayload.totalRecords;
    } else {
      console.error("Unexpected response structure from getUserBodyList:", responsePayload);
      logList.value = [];
      total.value = 0;
    }
  } catch (error: any) {
    console.error("Error fetching health logs:", error);
    logList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.pageNo = 1;
  fetchLogList();
};

const handleClearSearch = () => {
  searchKeyword.value = '';
  pagination.pageNo = 1;
  fetchLogList();
};

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    pagination.pageNo = newPage;
    fetchLogList();
  }
};

const clearErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
}

const validateForm = (): boolean => {
  clearErrors();
  let isValid = true;

  if (!logForm.value.name || logForm.value.name.length < 2 || logForm.value.name.length > 20) {
    errors.name = '姓名长度需在 2 到 20 个字符';
    isValid = false;
  }
  if (logForm.value.age === null || logForm.value.age === undefined || logForm.value.age <= 0 || logForm.value.age > 150) {
    errors.age = '请输入有效的年龄 (1-150)';
    isValid = false;
  }
  if (!logForm.value.gender) {
    errors.gender = '请选择性别';
    isValid = false;
  }
  if (logForm.value.height === null || logForm.value.height === undefined || logForm.value.height <= 0 || logForm.value.height > 300) {
    errors.height = '请输入有效身高 (cm)';
    isValid = false;
  }
  if (logForm.value.weight === null || logForm.value.weight === undefined || logForm.value.weight <= 0 || logForm.value.weight > 500) {
    errors.weight = '请输入有效体重 (kg)';
    isValid = false;
  }
  if (logForm.value.sleepQuality === null || logForm.value.sleepQuality === undefined) {
    errors.sleepQuality = '请选择睡眠质量';
    isValid = false;
  }

  return isValid;
}

const openAddDialog = () => {
  dialogTitle.value = '添加健康记录';
  logForm.value = JSON.parse(JSON.stringify(defaultLogForm));
  clearErrors();
  dialogVisible.value = true;
};

const openEditDialog = (item: BodyNotes) => {
  dialogTitle.value = '编辑健康记录';
  const formData = { ...item };
  if (typeof formData.foodTypes === 'string') {
    formData.foodTypes = formData.foodTypes ? formData.foodTypes.split(',') : [];
  } else if (!Array.isArray(formData.foodTypes)) {
    formData.foodTypes = [];
  }
  logForm.value = JSON.parse(JSON.stringify(formData));
  clearErrors();
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  logForm.value = {};
};

const submitForm = async () => {
  if (!validateForm()) {
    showNotification('warning', '请检查表单填写是否正确');
    return;
  }

  isSubmitting.value = true;
  try {
    const submissionData = { ...logForm.value };
    if (Array.isArray(submissionData.foodTypes)) {
      submissionData.foodTypes = submissionData.foodTypes.join(',');
    }

    let response;
    if (submissionData.notesid) {
      response = await healthApi.updateUserBody(submissionData);
    } else {
      response = await healthApi.addBodyInformationNotes(submissionData);
    }

    if (response.code === 20000) {
      showNotification('success', response.message || (submissionData.notesid ? '更新成功' : '添加成功'));
      closeDialog();
      fetchLogList();
    } else {
      showNotification('error', response.message || (submissionData.notesid ? '更新失败' : '添加失败'));
    }
  } catch (error) {
    console.error('提交表单失败:', error);
    const errorMsg = (error instanceof Error) ? error.message : '操作失败';
    showNotification('error', errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

const showConfirm = (message: string, onConfirm: () => Promise<void>) => {
  confirmMessage.value = message;
  confirmAction = onConfirm;
  confirmVisible.value = true;
};

const cancelConfirm = () => {
  confirmVisible.value = false;
  confirmAction = null;
};

const executeConfirm = async () => {
  if (confirmAction) {
    isDeleting.value = true;
    try {
      await confirmAction();
    } finally {
      isDeleting.value = false;
      cancelConfirm();
    }
  }
};

const handleDelete = async (logItem: any) => {
  if (!window.confirm(`您确定要删除用户 ${logItem.name} 的这条健康日志吗？`)) return;

  try {
    await healthApi.deleteUserBodyById(logItem.notesid);
    showNotification('success', '删除成功');

    if (logList.value.length === 1 && pagination.pageNo > 1) {
      pagination.pageNo--;
    }
    await fetchLogList();
  } catch (error: any) {
    console.error("Error deleting health log:", error);
    showNotification('error', error.message || '删除失败');
  }
};

// Formatting Helpers
const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (_e) {
    console.warn('日期格式化错误:', dateString, _e);
    return String(dateString);
  }
};

const formatSleepQuality = (quality: number | null | undefined): string => {
  const qualityNum = Number(quality);
  if (qualityNum === 1) return '好';
  if (qualityNum === 2) return '一般';
  if (qualityNum === 3) return '差';
  return '-';
}

const getSleepQualityClass = (quality: number | null | undefined): string => {
  const qualityNum = Number(quality);
  const baseClass = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  if (qualityNum === 1) return `${baseClass} bg-green-100 text-green-800`;
  if (qualityNum === 2) return `${baseClass} bg-yellow-100 text-yellow-800`;
  if (qualityNum === 3) return `${baseClass} bg-red-100 text-red-800`;
  return `${baseClass} bg-gray-100 text-gray-800`;
}

const getBooleanTagClass = (value: boolean | null | undefined, reverseDanger: boolean = false): string => {
  const baseClass = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  const isTrue = !!value;
  const isDanger = reverseDanger ? !isTrue : isTrue;

  if (isDanger) {
    return `${baseClass} bg-red-100 text-red-800`;
  } else {
    return `${baseClass} bg-green-100 text-green-800`;
  }
}

// Lifecycle Hooks
onMounted(() => {
  fetchLogList();
});

</script>

<style scoped>
/* 添加过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 新增：通知过渡效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* 确保表格在小屏幕上可滚动 */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* Removed rules using @apply */

/* 使标签和表单元素对齐 */
.items-center label {
  margin-bottom: 0;
}
</style>
