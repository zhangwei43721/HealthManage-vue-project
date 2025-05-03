<template>
  <div class="knowledge-manage-container p-5 bg-background-DEFAULT min-h-[calc(100vh-84px)]">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-text-primary mb-2">运动信息管理</h1>
      <p class="text-base text-text-secondary">管理各类运动的基本信息，包括频率、时间、速度和心率建议</p>
    </div>

    <!-- 搜索与操作区域 -->
    <Card class="mb-5" elevation="small">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- 搜索表单 -->
        <div class="flex items-center gap-2 flex-wrap">
          <InputField
            v-model="searchModel.sportType"
              placeholder="输入运动类型搜索"
            :leftIcon="Search"
            size="medium"
            class="w-full md:w-60"
            @keyup.enter="getSportInfoList"
          />
          <Button @click="getSportInfoList" type="primary" :icon="Search" :loading="listLoading">
            查询
          </Button>
          <Button @click="resetSearch" type="outline" :icon="Refresh">
            重置
          </Button>
        </div>
        <!-- 操作按钮 -->
        <div class="flex-shrink-0">
          <Button @click="openDialog()" type="secondary" :icon="Plus">
            新增运动信息
          </Button>
        </div>
      </div>
    </Card>

    <!-- 结果列表 -->
    <Card elevation="small">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-text-primary">运动信息列表</h2>
        <span class="text-sm text-text-secondary">共 {{ total }} 条记录</span>
      </div>

      <!-- 加载状态 -->
       <div v-if="listLoading" class="text-center py-10 text-text-secondary">
          加载中...
       </div>

      <!-- 表格 -->
       <div v-else-if="sportInfoList.length > 0" class="overflow-x-auto">
        <table class="w-full table-auto border-collapse text-left">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">运动类型</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">运动频率</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">运动时间</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">运动速度</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">运动心率</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider text-center">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sport in sportInfoList" :key="sport.id" class="hover:bg-background-light transition-colors duration-150">
              <td class="px-4 py-3 text-sm text-text-primary align-middle">{{ sport.id }}</td>
              <td class="px-4 py-3 text-sm text-text-primary align-middle">
                 <span class="inline-block px-2 py-1 text-xs font-semibold text-success bg-success/10 rounded">
                   {{ sport.sportType }}
                 </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle">{{ sport.suitableFrequency }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle">{{ sport.suitableTime }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle">{{ sport.recommendedSpeed }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle">{{ sport.suitableHeartRate }}</td>
              <td class="px-4 py-3 text-center align-middle">
                <div class="flex justify-center items-center gap-2">
                  <Button @click="openDialog(sport.id)" type="primary" :icon="Edit" size="small" iconOnly tooltip="编辑"></Button>
                  <Button @click="deleteSportInfo(sport)" type="danger" :icon="Delete" size="small" iconOnly tooltip="删除"></Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
       <div v-else class="text-center py-10 text-text-secondary">
         <Weightlifting theme="outline" size="48" class="mx-auto mb-4 text-gray-400"/>
         <p class="mb-4">暂无运动信息数据</p>
         <Button type="primary" size="small" @click="openDialog()">添加第一条运动信息</Button>
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
              <!-- Page numbers could be added here for more complex pagination -->
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
                  @change="getSportInfoList"
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

    <!-- 运动信息编辑/新增弹窗 -->
    <Modal v-model="dialogFormVisible" :title="dialogTitle" size="lg" backdropStyle="glass">
      <!-- 保存消息提示 -->
      <div v-if="saveMessage" :class="['mb-4 p-3 rounded text-sm', saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
        {{ saveMessage.text }}
      </div>

      <!-- 表单 -->
      <form @submit.prevent="saveSportInfo" class="space-y-4">
        <div>
          <label for="sportType" class="block text-sm font-medium text-text-secondary mb-1">运动类型 <span class="text-red-500">*</span></label>
          <InputField
            id="sportType"
            v-model="sportInfoForm.sportType"
            placeholder="例如：跑步、游泳、瑜伽"
            :error="!!formErrors.sportType"
            :errorMessage="formErrors.sportType"
            required
          />
        </div>
        <div>
          <label for="suitableFrequency" class="block text-sm font-medium text-text-secondary mb-1">运动频率 <span class="text-red-500">*</span></label>
          <InputField
            id="suitableFrequency"
            v-model="sportInfoForm.suitableFrequency"
            placeholder="例如：每周 3-5 次"
            :error="!!formErrors.suitableFrequency"
            :errorMessage="formErrors.suitableFrequency"
            required
          />
        </div>
        <div>
          <label for="suitableTime" class="block text-sm font-medium text-text-secondary mb-1">运动时间 <span class="text-red-500">*</span></label>
          <InputField
            id="suitableTime"
            v-model="sportInfoForm.suitableTime"
            placeholder="例如：每次 30-45 分钟"
            :error="!!formErrors.suitableTime"
            :errorMessage="formErrors.suitableTime"
            required
          />
        </div>
        <div>
          <label for="recommendedSpeed" class="block text-sm font-medium text-text-secondary mb-1">运动速度/强度 <span class="text-red-500">*</span></label>
          <InputField
            id="recommendedSpeed"
            v-model="sportInfoForm.recommendedSpeed"
            placeholder="例如：中等强度，保持微喘"
            :error="!!formErrors.recommendedSpeed"
            :errorMessage="formErrors.recommendedSpeed"
            required
          />
        </div>
        <div>
          <label for="suitableHeartRate" class="block text-sm font-medium text-text-secondary mb-1">运动心率 <span class="text-red-500">*</span></label>
          <InputField
            id="suitableHeartRate"
            v-model="sportInfoForm.suitableHeartRate"
            placeholder="例如：120-150 次/分钟"
            :error="!!formErrors.suitableHeartRate"
            :errorMessage="formErrors.suitableHeartRate"
            required
          />
        </div>

      <!-- 弹窗底部按钮 -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <Button type="outline" @click="closeDialog">取 消</Button>
          <Button type="primary" nativeType="submit" :loading="saveLoading">确 定</Button>
      </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from '@/composables/vue-imports';
// --- Type Imports ---
import type { SportInfo } from '@/types/sport'; // Import SportInfo type

// --- API Service Imports ---
import knowledgeManageApi from "@/services/knowledgeManage";

// --- Custom Base Component Imports ---
import Button from '@/components/base/Button.vue';
import Card from '@/components/base/Card.vue';
import InputField from '@/components/base/InputField.vue';
import Modal from '@/components/base/Modal.vue';

// --- Icon Imports ---
import { Search, Refresh, Plus, Edit, Delete, Close, Weightlifting } from '@icon-park/vue-next';

// --- Reactive State ---
const searchModel = reactive({
    sportType: '', // Search by sport type
    pageNo: 1,
    pageSize: 10,
});

const listLoading = ref(false);
const sportInfoList = ref<SportInfo[]>([]);
const total = ref(0);

const dialogFormVisible = ref(false);
const saveLoading = ref(false);
const isEditMode = ref(false);
// Form data model
const sportInfoForm = reactive<Partial<SportInfo>>({
    id: undefined,
        sportType: '',
        suitableFrequency: '',
        suitableTime: '',
        recommendedSpeed: '',
        suitableHeartRate: ''
});
// Form errors
const formErrors = reactive<Record<keyof Omit<SportInfo, 'id'>, string>>({
        sportType: '',
    suitableFrequency: '',
    suitableTime: '',
    recommendedSpeed: '',
    suitableHeartRate: ''
});
// Save status message
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// --- Computed Properties ---
const dialogTitle = computed(() => (isEditMode.value ? '编辑运动信息' : '新增运动信息'));
const totalPages = computed(() => Math.ceil(total.value / searchModel.pageSize));

// --- Validation Logic --- (Simple required check)
const validateForm = (): boolean => {
    clearFormErrors();
    let isValid = true;
    const fields: (keyof typeof formErrors)[] = [
        'sportType', 'suitableFrequency', 'suitableTime', 'recommendedSpeed', 'suitableHeartRate'
    ];

    fields.forEach(field => {
        if (!sportInfoForm[field]?.trim()) {
             // Simple label mapping, could be more sophisticated
             const labelMap: Record<string, string> = {
                sportType: '运动类型',
                suitableFrequency: '运动频率',
                suitableTime: '运动时间',
                recommendedSpeed: '运动速度/强度',
                suitableHeartRate: '运动心率'
            };
            formErrors[field] = `${labelMap[field] || field}不能为空`;
            isValid = false;
        }
    });
    return isValid;
};

const clearFormErrors = () => {
    // Correctly iterate over keys of formErrors, ensuring key is treated as string
    (Object.keys(formErrors) as Array<keyof typeof formErrors>).forEach(key => {
         // Explicitly assert key type if needed, though the cast above should suffice
         formErrors[key] = '';
    });
    saveMessage.value = null;
};

// --- API Methods ---
const getSportInfoList = async () => {
    listLoading.value = true;
    saveMessage.value = null;
    try {
        const response = await knowledgeManageApi.getSportList(searchModel);
        if (response && response.data && Array.isArray(response.data.rows)) {
            sportInfoList.value = response.data.rows;
            total.value = response.data.total;
        } else {
            console.error("Unexpected response structure from getSportList:", response);
            sportInfoList.value = [];
            total.value = 0;
            saveMessage.value = { type: 'error', text: '获取运动列表失败: 响应格式错误' };
        }
      } catch (error) {
        console.error("Error fetching sport list:", error);
        sportInfoList.value = [];
        total.value = 0;
        saveMessage.value = { type: 'error', text: `获取运动列表失败: ${error instanceof Error ? error.message : '未知错误'}` };
      } finally {
        listLoading.value = false;
    }
};

const openDialog = async (id?: number) => {
    clearFormErrors();
    if (id) {
        isEditMode.value = true;
        try {
            const response = await knowledgeManageApi.getSportInfoById(id);
            const formData = response.data as SportInfo;
            if (formData && typeof formData === 'object' && 'id' in formData) {
                Object.assign(sportInfoForm, formData);
            } else {
                throw new Error("获取的运动信息格式无效");
            }
        } catch (error) {
            console.error("Error fetching sport info by ID:", error);
            saveMessage.value = { type: 'error', text: `获取运动信息失败: ${error instanceof Error ? error.message : '未知错误'}` };
            return; // Don't open dialog if fetch fails
        }
    } else {
        isEditMode.value = false;
        // Reset form for adding new
        Object.assign(sportInfoForm, {
            id: undefined,
            sportType: '',
            suitableFrequency: '',
            suitableTime: '',
            recommendedSpeed: '',
            suitableHeartRate: ''
        });
    }
    dialogFormVisible.value = true;
};

const closeDialog = () => {
    dialogFormVisible.value = false;
};

const saveSportInfo = async () => {
    if (!validateForm()) {
        return;
    }
    saveLoading.value = true;
    saveMessage.value = null;
    try {
        if (isEditMode.value && sportInfoForm.id) {
            await knowledgeManageApi.updateSportInfo(sportInfoForm as SportInfo);
            saveMessage.value = { type: 'success', text: '运动信息更新成功' };
        } else {
            const { id, ...addData } = sportInfoForm;
            await knowledgeManageApi.addSportInfo(addData as Omit<SportInfo, 'id'>);
            saveMessage.value = { type: 'success', text: '运动信息添加成功' };
        }
        closeDialog();
        await getSportInfoList();
    } catch (error) {
        console.error("Save sport info error:", error);
        saveMessage.value = { type: 'error', text: `操作失败: ${error instanceof Error ? error.message : '未知错误'}` };
    } finally {
        saveLoading.value = false;
    }
};

const deleteSportInfo = async (sport: SportInfo) => {
    if (window.confirm(`确定要删除运动类型【${sport.sportType}】吗？`)) {
        listLoading.value = true;
        saveMessage.value = null;
        try {
            await knowledgeManageApi.deleteSportInfo(sport.id);
            saveMessage.value = { type: 'success', text: '运动信息删除成功' };
            if (sportInfoList.value.length === 1 && searchModel.pageNo > 1) {
                searchModel.pageNo--;
            }
            await getSportInfoList();
        } catch (error) {
            console.error("Delete sport info error:", error);
            saveMessage.value = { type: 'error', text: `删除失败: ${error instanceof Error ? error.message : '未知错误'}` };
            listLoading.value = false;
        }
    }
};

// --- UI Methods ---
const resetSearch = () => {
    searchModel.sportType = '';
    searchModel.pageNo = 1;
    getSportInfoList();
};

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        searchModel.pageNo = page;
        getSportInfoList();
    }
};

// --- Lifecycle Hooks ---
onMounted(() => {
    getSportInfoList();
});

</script>

<style scoped>
/* Add any specific scoped styles if needed */
</style>
