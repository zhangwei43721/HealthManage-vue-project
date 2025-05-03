<template>
  <div class="user-health-manage-container p-5 bg-background-DEFAULT min-h-[calc(100vh-84px)]">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-text-primary mb-2">用户健康数据管理</h1>
      <p class="text-base text-text-secondary">管理所有用户的身体健康数据，支持筛选、查看和维护</p>
    </div>

    <!-- 搜索与操作区域 -->
    <Card class="mb-5" elevation="small">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- 搜索表单 -->
        <div class="flex items-center gap-3 flex-wrap">
          <InputField
            v-model="searchModel.name"
            placeholder="输入用户姓名"
            :leftIcon="UserIcon"
            size="medium"
            class="w-full sm:w-auto"
            @keyup.enter="getBodyDataList"
          />
           <InputField
            v-model="searchModel.id"
            placeholder="输入用户ID"
            type="number"
            :leftIcon="IdCardH"
            size="medium"
            class="w-full sm:w-auto"
            @keyup.enter="getBodyDataList"
          />
           <!-- Add other search fields like gender if needed -->
          <Button @click="getBodyDataList" type="primary" :icon="Search" :loading="listLoading">
            查询
          </Button>
          <Button @click="resetSearch" type="outline" :icon="Refresh">
            重置
          </Button>
           <!-- Removed Add button as per API spec (admin adds via BodyNotes?) -->
           <!-- <Button @click="openDialog()" type="secondary" :icon="Plus">
            新增记录
          </Button> -->
        </div>
      </div>
    </Card>

    <!-- 结果列表 -->
    <Card elevation="small">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-text-primary">健康数据列表</h2>
        <span class="text-sm text-text-secondary">共 {{ total }} 条记录</span>
      </div>

      <!-- 加载状态 -->
       <div v-if="listLoading" class="text-center py-10 text-text-secondary">
          加载中...
       </div>

      <!-- 表格 -->
       <div v-else-if="bodyDataList.length > 0" class="overflow-x-auto">
        <table class="w-full table-auto border-collapse text-left text-sm">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">ID</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">姓名</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">年龄</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">性别</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">身高(cm)</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">体重(kg)</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">血糖</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">血压</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">血脂</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">心率</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">视力</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">睡眠时长(h)</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">睡眠质量</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">吸烟</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">饮酒</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider">运动</th>
              <th class="p-3 font-medium text-text-secondary uppercase tracking-wider text-center">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="bodyData in bodyDataList" :key="bodyData.id" class="hover:bg-background-light transition-colors duration-150">
              <td class="p-3 text-text-primary align-middle">{{ bodyData.id }}</td>
              <td class="p-3 text-text-primary align-middle">{{ bodyData.name }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.age }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.gender }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.height }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.weight }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.bloodSugar }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.bloodPressure }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.bloodLipid }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.heartRate }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ formatVision(bodyData.vision) }}</td>
              <td class="p-3 text-text-secondary align-middle">{{ bodyData.sleepDuration }}</td>
              <td class="p-3 text-text-secondary align-middle">
                 <span :class="getQualityClass(bodyData.sleepQuality)">{{ bodyData.sleepQuality }}</span>
              </td>
               <td class="p-3 text-center align-middle">
                 <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', bodyData.smoking ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
                   {{ bodyData.smoking ? '是' : '否' }}
                 </span>
              </td>
               <td class="p-3 text-center align-middle">
                 <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', bodyData.drinking ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
                   {{ bodyData.drinking ? '是' : '否' }}
                 </span>
               </td>
               <td class="p-3 text-center align-middle">
                 <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', bodyData.exercise ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                    {{ bodyData.exercise ? '是' : '否' }}
                 </span>
              </td>
              <td class="p-3 text-center align-middle">
                <div class="flex justify-center items-center gap-2">
                  <Button @click="openDialog(bodyData.id)" type="primary" :icon="Edit" size="small" iconOnly tooltip="编辑"></Button>
                   <Button @click="confirmDelete(bodyData)" type="danger" :icon="Delete" size="small" iconOnly tooltip="删除"></Button>
                   <!-- View Logs Button could be added here -->
                   <!-- <Button @click="viewLogs(bodyData.id)" type="secondary" :icon="DocDetail" size="small" iconOnly tooltip="查看记录"></Button> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
       <div v-else class="text-center py-10 text-text-secondary">
         <ChartHistogram theme="outline" size="48" class="mx-auto mb-4 text-gray-400"/>
         <p class="mb-4">暂无用户健康数据</p>
         <!-- <Button type="primary" size="small" @click="openDialog()">添加第一条记录</Button> -->
       </div>

      <!-- 分页 -->
      <div v-if="total > 0 && !listLoading" class="mt-5 flex flex-col md:flex-row justify-between items-center">
          <span class="text-sm text-text-secondary mb-2 md:mb-0">
              共 {{ total }} 条记录，当前第 {{ searchModel.pageNo }} / {{ totalPages }} 页
          </span>
          <div class="flex items-center gap-2">
              <Button
                  type="outline"
                  size="small"
                  :disabled="searchModel.pageNo <= 1"
                  @click="goToPage(searchModel.pageNo - 1)"
              >
                  上一页
              </Button>
              <Button
                  type="outline"
                  size="small"
                  :disabled="searchModel.pageNo >= totalPages"
                  @click="goToPage(searchModel.pageNo + 1)"
              >
                  下一页
              </Button>
              <select
                  v-model="searchModel.pageSize"
                  @change="getBodyDataList"
                  class="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
               >
                  <option value="5">5 条/页</option>
                  <option value="10">10 条/页</option>
                  <option value="20">20 条/页</option>
                  <option value="50">50 条/页</option>
              </select>
          </div>
      </div>

    </Card>

    <!-- 健康数据编辑弹窗 (No Add for admin on Body table) -->
    <div v-if="dialogFormVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto" @click.self="closeDialog">
      <Card class="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white" elevation="large">
        <div class="flex justify-between items-center mb-5 pb-3 border-b">
          <h3 class="text-xl font-semibold text-text-primary">{{ dialogTitle }}</h3>
          <Button type="text" :icon="Close" @click="closeDialog" iconOnly tooltip="关闭"></Button>
        </div>

        <!-- 保存消息提示 -->
        <div v-if="saveMessage" :class="['mb-4 p-3 rounded text-sm', saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
          {{ saveMessage.text }}
        </div>

        <!-- 表单 -->
        <form @submit.prevent="saveBodyData" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <!-- Basic Info -->
          <div class="md:col-span-2 font-medium text-text-primary border-b pb-1 mb-2">基本信息</div>
          <div>
            <label for="bodyName" class="block text-sm font-medium text-text-secondary mb-1">姓名 <span class="text-red-500">*</span></label>
            <InputField id="bodyName" v-model="bodyForm.name" placeholder="用户姓名" :error="!!formErrors.name" :errorMessage="formErrors.name" required />
          </div>
          <div>
            <label for="bodyAge" class="block text-sm font-medium text-text-secondary mb-1">年龄 <span class="text-red-500">*</span></label>
            <InputField id="bodyAge" v-model.number="bodyForm.age" type="number" placeholder="年龄" :error="!!formErrors.age" :errorMessage="formErrors.age" required />
          </div>
          <div>
             <label for="bodyGender" class="block text-sm font-medium text-text-secondary mb-1">性别 <span class="text-red-500">*</span></label>
             <select id="bodyGender" v-model="bodyForm.gender" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md" :class="{'border-red-500': !!formErrors.gender}">
                 <option value="男">男</option>
                 <option value="女">女</option>
             </select>
              <p v-if="formErrors.gender" class="mt-1 text-xs text-red-600">{{ formErrors.gender }}</p>
          </div>

           <!-- Body Metrics -->
           <div class="md:col-span-2 font-medium text-text-primary border-b pb-1 mb-2 mt-4">身体指标</div>
           <div>
             <label for="bodyHeight" class="block text-sm font-medium text-text-secondary mb-1">身高 (cm) <span class="text-red-500">*</span></label>
             <InputField id="bodyHeight" v-model.number="bodyForm.height" type="number" placeholder="身高" :error="!!formErrors.height" :errorMessage="formErrors.height" required />
           </div>
           <div>
             <label for="bodyWeight" class="block text-sm font-medium text-text-secondary mb-1">体重 (kg) <span class="text-red-500">*</span></label>
             <InputField id="bodyWeight" v-model.number="bodyForm.weight" type="number" placeholder="体重" :error="!!formErrors.weight" :errorMessage="formErrors.weight" required />
           </div>
            <div>
             <label for="bodyHeartRate" class="block text-sm font-medium text-text-secondary mb-1">心率 (次/分) <span class="text-red-500">*</span></label>
             <InputField id="bodyHeartRate" v-model.number="bodyForm.heartRate" type="number" placeholder="静息心率" :error="!!formErrors.heartRate" :errorMessage="formErrors.heartRate" required />
           </div>
           <div>
             <label for="bodyVision" class="block text-sm font-medium text-text-secondary mb-1">视力 (5.0记为50) <span class="text-red-500">*</span></label>
             <InputField id="bodyVision" v-model.number="bodyForm.vision" type="number" placeholder="视力" :error="!!formErrors.vision" :errorMessage="formErrors.vision" required />
           </div>

           <!-- Health Indicators -->
            <div class="md:col-span-2 font-medium text-text-primary border-b pb-1 mb-2 mt-4">健康指标</div>
             <div>
               <label for="bodyBloodSugar" class="block text-sm font-medium text-text-secondary mb-1">血糖 (mmol/L) <span class="text-red-500">*</span></label>
               <InputField id="bodyBloodSugar" v-model.number="bodyForm.bloodSugar" type="number" step="0.1" placeholder="血糖值" :error="!!formErrors.bloodSugar" :errorMessage="formErrors.bloodSugar" required />
            </div>
            <div>
               <label for="bodyBloodPressure" class="block text-sm font-medium text-text-secondary mb-1">血压 (mmHg) <span class="text-red-500">*</span></label>
               <InputField id="bodyBloodPressure" v-model="bodyForm.bloodPressure" placeholder="例如: 120/80" :error="!!formErrors.bloodPressure" :errorMessage="formErrors.bloodPressure" required />
            </div>
             <div>
               <label for="bodyBloodLipid" class="block text-sm font-medium text-text-secondary mb-1">血脂 <span class="text-red-500">*</span></label>
               <InputField id="bodyBloodLipid" v-model="bodyForm.bloodLipid" placeholder="例如: 正常 / 偏高" :error="!!formErrors.bloodLipid" :errorMessage="formErrors.bloodLipid" required />
             </div>

           <!-- Lifestyle -->
            <div class="md:col-span-2 font-medium text-text-primary border-b pb-1 mb-2 mt-4">生活习惯</div>
            <div>
               <label for="bodySleepDuration" class="block text-sm font-medium text-text-secondary mb-1">睡眠时长 (h) <span class="text-red-500">*</span></label>
               <InputField id="bodySleepDuration" v-model.number="bodyForm.sleepDuration" type="number" step="0.5" placeholder="小时" :error="!!formErrors.sleepDuration" :errorMessage="formErrors.sleepDuration" required />
            </div>
             <div>
               <label for="bodySleepQuality" class="block text-sm font-medium text-text-secondary mb-1">睡眠质量 <span class="text-red-500">*</span></label>
               <InputField id="bodySleepQuality" v-model="bodyForm.sleepQuality" placeholder="例如: 良好 / 一般 / 差" :error="!!formErrors.sleepQuality" :errorMessage="formErrors.sleepQuality" required />
             </div>
             <div>
               <label for="bodyWaterConsumption" class="block text-sm font-medium text-text-secondary mb-1">日均饮水量 (L) <span class="text-red-500">*</span></label>
               <InputField id="bodyWaterConsumption" v-model.number="bodyForm.waterConsumption" type="number" step="0.1" placeholder="升" :error="!!formErrors.waterConsumption" :errorMessage="formErrors.waterConsumption" required />
             </div>
             <div>
               <label for="bodyFoodTypes" class="block text-sm font-medium text-text-secondary mb-1">主要食物类型</label>
               <InputField id="bodyFoodTypes" v-model="bodyForm.foodTypes" placeholder="简单描述饮食习惯" :error="!!formErrors.foodTypes" :errorMessage="formErrors.foodTypes" />
             </div>
             <div class="flex items-center gap-4">
                 <label class="flex items-center">
                     <input type="checkbox" v-model="bodyForm.smoking" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                     <span class="ml-2 text-sm text-text-secondary">是否吸烟</span>
                 </label>
                 <label class="flex items-center">
                     <input type="checkbox" v-model="bodyForm.drinking" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                     <span class="ml-2 text-sm text-text-secondary">是否饮酒</span>
                 </label>
                 <label class="flex items-center">
                     <input type="checkbox" v-model="bodyForm.exercise" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                     <span class="ml-2 text-sm text-text-secondary">规律运动</span>
                 </label>
             </div>

          <!-- 弹窗底部按钮 -->
          <div class="md:col-span-2 flex justify-end gap-3 pt-5 border-t mt-4">
            <Button type="outline" @click="closeDialog">取 消</Button>
            <Button type="primary" nativeType="submit" :loading="saveLoading">保 存</Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
// --- Type Imports ---
import type { Body } from '@/types/health';

// --- API Service Imports ---
import userHealthManageApi from "@/services/userHealthManage";

// --- Custom Base Component Imports ---
import Button from '@/components/base/Button.vue';
import Card from '@/components/base/Card.vue';
import InputField from '@/components/base/InputField.vue';

// --- Icon Imports ---
import { Search, Refresh, Plus, Edit, Delete, Close, ChartHistogram, User as UserIcon, IdCardH, DocDetail } from '@icon-park/vue-next';

// --- Reactive State ---
const searchModel = reactive({
    name: '',
    id: '', // ID is usually number, but input can be string initially
    // Add other filters like gender if needed
    // gender: '',
    pageNo: 1,
    pageSize: 10,
});

const listLoading = ref(false);
const bodyDataList = ref<Body[]>([]);
const total = ref(0);

const dialogFormVisible = ref(false);
const saveLoading = ref(false);
const isEditMode = ref(false); // Always edit mode for Body table via admin
// Form data model
const bodyForm = reactive<Partial<Body>>({});
// Form errors (Define keys based on Body interface)
const formErrors = reactive<Record<keyof Omit<Body, 'id'>, string>>({
    name: '', age: '', gender: '', height: '', weight: '', bloodSugar: '',
    bloodPressure: '', bloodLipid: '', heartRate: '', vision: '', sleepDuration: '',
    sleepQuality: '', smoking: '', drinking: '', exercise: '', foodTypes: '',
    waterConsumption: ''
});
// Save status message
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// --- Computed Properties ---
const dialogTitle = computed(() => '编辑用户健康数据'); // Always edit for Body
const totalPages = computed(() => Math.ceil(total.value / searchModel.pageSize));

// --- Helper Functions ---
const formatVision = (visionValue: number | undefined | null): string => {
    if (visionValue == null) return '-';
    // Assuming vision is stored as integer (e.g., 50 for 5.0)
    return (visionValue / 10).toFixed(1);
};

const getQualityClass = (quality: string | undefined | null): string => {
    if (!quality) return 'text-gray-500';
    quality = quality.toLowerCase();
    if (quality.includes('良好') || quality.includes('good')) return 'text-green-600 font-medium';
    if (quality.includes('一般') || quality.includes('normal') || quality.includes('fair')) return 'text-yellow-600';
    if (quality.includes('差') || quality.includes('poor')) return 'text-red-600';
    return 'text-gray-500'; // Default
};

// --- Validation Logic ---
const validateForm = (): boolean => {
    clearFormErrors();
    let isValid = true;
    const requiredFields: (keyof typeof formErrors)[] = [
        'name', 'age', 'gender', 'height', 'weight', 'bloodSugar',
        'bloodPressure', 'bloodLipid', 'heartRate', 'vision', 'sleepDuration',
        'sleepQuality', 'waterConsumption'
        // smoking, drinking, exercise are boolean, no check needed unless specific rules apply
        // foodTypes is optional
    ];

    requiredFields.forEach(field => {
        const value = bodyForm[field];
        if (value === undefined || value === null || String(value).trim() === '') {
             // Simple label mapping
            const labelMap: Record<string, string> = {
                 name: '姓名', age: '年龄', gender: '性别', height: '身高', weight: '体重',
                 bloodSugar: '血糖', bloodPressure: '血压', bloodLipid: '血脂', heartRate: '心率',
                 vision: '视力', sleepDuration: '睡眠时长', sleepQuality: '睡眠质量',
                 waterConsumption: '日均饮水量'
             };
            formErrors[field] = `${labelMap[field] || field}不能为空`;
            isValid = false;
        }
        // Add specific type/range checks if needed (e.g., age > 0)
        if ((field === 'age' || field === 'height' || field === 'weight' || field === 'heartRate' || field === 'vision' || field === 'sleepDuration' || field === 'waterConsumption' || field === 'bloodSugar') && typeof value === 'number' && value < 0) {
             formErrors[field] = '不能为负数';
             isValid = false;
        }
    });
    return isValid;
};

const clearFormErrors = () => {
    (Object.keys(formErrors) as Array<keyof typeof formErrors>).forEach(key => {
        formErrors[key] = '';
    });
    saveMessage.value = null;
};

// --- API Methods ---
const getBodyDataList = async () => {
    listLoading.value = true;
    saveMessage.value = null;
    try {
        // Prepare search params, convert id if present
        const params: any = { ...searchModel };
        if (params.id) {
            params.id = parseInt(params.id, 10);
            if (isNaN(params.id)) {
                delete params.id; // Remove if not a valid number
            }
        }

        const response = await userHealthManageApi.getAllBodyList(params);
        if (response && response.data && Array.isArray(response.data.rows)) {
            bodyDataList.value = response.data.rows;
            total.value = response.data.total;
        } else {
            console.error("Unexpected response structure from getAllBodyList:", response);
            bodyDataList.value = [];
            total.value = 0;
            saveMessage.value = { type: 'error', text: '获取健康数据列表失败: 响应格式错误' };
        }
    } catch (error) {
        console.error("Error fetching body data list:", error);
        bodyDataList.value = [];
        total.value = 0;
        saveMessage.value = { type: 'error', text: `获取健康数据列表失败: ${error instanceof Error ? error.message : '未知错误'}` };
    } finally {
        listLoading.value = false;
    }
};

const openDialog = async (id?: number) => {
    if (!id) return; // Admin can only edit existing Body records, not add
    clearFormErrors();
    isEditMode.value = true; // Always edit mode
    try {
        const response = await userHealthManageApi.getBodyById(id);
        const formData = response.data as Body;
        if (formData && typeof formData === 'object' && 'id' in formData) {
            // Convert boolean fields to boolean type if they are 0/1 from backend
            Object.assign(bodyForm, {
                ...formData,
                smoking: !!formData.smoking,
                drinking: !!formData.drinking,
                exercise: !!formData.exercise,
            });
             dialogFormVisible.value = true;
        } else {
            throw new Error("获取的健康数据格式无效");
        }
    } catch (error) {
        console.error("Error fetching body data by ID:", error);
        saveMessage.value = { type: 'error', text: `获取健康数据失败: ${error instanceof Error ? error.message : '未知错误'}` };
    }
};

const closeDialog = () => {
    dialogFormVisible.value = false;
    // Reset form to avoid showing old data briefly on next open
    Object.keys(bodyForm).forEach(key => delete bodyForm[key as keyof Body]);
};

const saveBodyData = async () => {
    if (!validateForm() || !bodyForm.id) { // Ensure ID exists for update
        return;
    }
    saveLoading.value = true;
    saveMessage.value = null;
    try {
        // Admin uses updateBody API
        await userHealthManageApi.updateBody(bodyForm as Body);
        saveMessage.value = { type: 'success', text: '健康数据更新成功' };
        closeDialog();
        await getBodyDataList();
    } catch (error) {
        console.error("Save body data error:", error);
        saveMessage.value = { type: 'error', text: `操作失败: ${error instanceof Error ? error.message : '未知错误'}` };
    } finally {
        saveLoading.value = false;
    }
};

const confirmDelete = async (bodyData: Body) => {
    if (window.confirm(`确定要删除用户【${bodyData.name}】(ID: ${bodyData.id}) 的这条健康数据吗？`)) {
        listLoading.value = true;
        saveMessage.value = null;
        try {
            // Admin uses deleteBodyById API
            await userHealthManageApi.deleteBodyById(bodyData.id);
            saveMessage.value = { type: 'success', text: '健康数据删除成功' };
            if (bodyDataList.value.length === 1 && searchModel.pageNo > 1) {
                searchModel.pageNo--;
            }
            await getBodyDataList();
        } catch (error) {
            console.error("Delete body data error:", error);
            saveMessage.value = { type: 'error', text: `删除失败: ${error instanceof Error ? error.message : '未知错误'}` };
            listLoading.value = false;
        }
    }
};

// --- UI Methods ---
const resetSearch = () => {
    searchModel.name = '';
    searchModel.id = '';
    searchModel.pageNo = 1;
    getBodyDataList();
};

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        searchModel.pageNo = page;
        getBodyDataList();
    }
};

// --- Lifecycle Hooks ---
onMounted(() => {
    getBodyDataList();
});

</script>

<style scoped>
/* Add any specific scoped styles if needed */
</style>
