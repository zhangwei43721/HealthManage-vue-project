<template>
  <div class="sport-detail-manage-container p-5 bg-background-DEFAULT min-h-[calc(100vh-84px)]">
    <!-- 页面标题 -->
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-text-primary mb-2">运动详情管理</h1>
      <p class="text-base text-text-secondary">管理各类运动的详细信息，包括运动方法、禁忌疾病和注意事项</p>
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
            @keyup.enter="getDetailList"
          />
          <Button @click="getDetailList" type="primary" :icon="Search" :loading="listLoading">
            查询
          </Button>
          <Button @click="resetSearch" type="outline" :icon="Refresh">
            重置
          </Button>
        </div>
        <!-- 操作按钮 -->
        <div class="flex-shrink-0">
          <Button @click="openDialog()" type="secondary" :icon="Plus">
            新增运动详情
          </Button>
        </div>
      </div>
    </Card>

    <!-- 结果列表 -->
    <Card elevation="small">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-text-primary">运动详情列表</h2>
        <span class="text-sm text-text-secondary">共 {{ total }} 条记录</span>
      </div>

      <!-- 加载状态 -->
       <div v-if="listLoading" class="text-center py-10 text-text-secondary">
          加载中...
       </div>

      <!-- 表格 -->
       <div v-else-if="detailList.length > 0" class="overflow-x-auto">
        <table class="w-full table-auto border-collapse text-left">
          <thead class="bg-gray-100 border-b">
            <tr>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">运动类型</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">禁忌疾病</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">运动方法</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider">注意事项</th>
              <th class="px-4 py-3 text-sm font-medium text-text-secondary uppercase tracking-wider text-center">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="detail in detailList" :key="detail.id" class="hover:bg-background-light transition-colors duration-150">
              <td class="px-4 py-3 text-sm text-text-primary align-middle">{{ detail.id }}</td>
              <td class="px-4 py-3 text-sm text-text-primary align-middle">
                 <span class="inline-block px-2 py-1 text-xs font-semibold text-secondary bg-secondary/10 rounded">
                   {{ detail.sportType }}
                 </span>
              </td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle max-w-xs truncate" :title="detail.disease">{{ detail.disease }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle max-w-sm truncate" :title="detail.method">{{ detail.method }}</td>
              <td class="px-4 py-3 text-sm text-text-secondary align-middle max-w-xs truncate" :title="detail.notes">{{ detail.notes }}</td>
              <td class="px-4 py-3 text-center align-middle">
                <div class="flex justify-center items-center gap-2">
                  <Button @click="openDialog(detail.id)" type="primary" :icon="Edit" size="small" iconOnly tooltip="编辑"></Button>
                  <Button @click="deleteDetail(detail)" type="danger" :icon="Delete" size="small" iconOnly tooltip="删除"></Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空状态 -->
       <div v-else class="text-center py-10 text-text-secondary">
         <Clipboard theme="outline" size="48" class="mx-auto mb-4 text-gray-400"/>
         <p class="mb-4">暂无运动详情数据</p>
         <Button type="primary" size="small" @click="openDialog()">添加第一条运动详情</Button>
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
                  @change="getDetailList"
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

    <!-- 运动详情编辑/新增弹窗 -->
    <Modal v-model="dialogFormVisible" :title="dialogTitle" size="lg" backdropStyle="glass">
      <!-- 保存消息提示 -->
      <div v-if="saveMessage" :class="['mb-4 p-3 rounded text-sm', saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
        {{ saveMessage.text }}
      </div>

      <!-- 表单 -->
      <form @submit.prevent="saveDetail" class="space-y-4">
        <div>
          <label for="detailSportType" class="block text-sm font-medium text-text-secondary mb-1">运动类型 <span class="text-red-500">*</span></label>
          <InputField
            id="detailSportType"
            v-model="detailForm.sportType"
            placeholder="例如：跑步、游泳"
            :error="!!formErrors.sportType"
            :errorMessage="formErrors.sportType"
            required
          />
        </div>
        <div>
          <label for="detailDisease" class="block text-sm font-medium text-text-secondary mb-1">禁忌疾病</label>
          <InputField
            id="detailDisease"
            v-model="detailForm.disease"
            placeholder="例如：心脏病、高血压患者不宜剧烈运动"
            type="textarea"
            :rows="3"
            :error="!!formErrors.disease"
            :errorMessage="formErrors.disease"
          />
        </div>
         <div>
          <label for="detailMethod" class="block text-sm font-medium text-text-secondary mb-1">运动方法 <span class="text-red-500">*</span></label>
          <InputField
            id="detailMethod"
            v-model="detailForm.method"
            placeholder="详细描述运动步骤、技巧等"
            type="textarea"
            :rows="5"
            :error="!!formErrors.method"
            :errorMessage="formErrors.method"
            required
          />
        </div>
         <div>
          <label for="detailNotes" class="block text-sm font-medium text-text-secondary mb-1">注意事项</label>
          <InputField
            id="detailNotes"
            v-model="detailForm.notes"
            placeholder="例如：运动前热身、运动后拉伸"
            type="textarea"
            :rows="4"
            :error="!!formErrors.notes"
            :errorMessage="formErrors.notes"
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
import { ref, reactive, onMounted, computed } from 'vue';
// --- Type Imports ---
import type { Detail } from '@/types/sport'; // Import Detail type

// --- API Service Imports ---
import sportItemManageApi from "@/services/sportItemManage";

// --- Custom Base Component Imports ---
import Button from '@/components/base/Button.vue';
import Card from '@/components/base/Card.vue';
import InputField from '@/components/base/InputField.vue';
import Modal from '@/components/base/Modal.vue';

// --- Icon Imports ---
import { Search, Refresh, Plus, Edit, Delete, Close, Clipboard } from '@icon-park/vue-next';

// --- Reactive State ---
const searchModel = reactive({
    sportType: '', // Search by sport type
    pageNo: 1,
    pageSize: 10,
});

const listLoading = ref(false);
const detailList = ref<Detail[]>([]);
const total = ref(0);

const dialogFormVisible = ref(false);
const saveLoading = ref(false);
const isEditMode = ref(false);
// Form data model
const detailForm = reactive<Partial<Detail>>({
    id: undefined,
    sportType: '',
    disease: '',
    method: '',
    notes: ''
});
// Form errors
const formErrors = reactive<Record<keyof Omit<Detail, 'id'>, string>>({
    sportType: '',
    disease: '',
    method: '',
    notes: ''
});
// Save status message
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// --- Computed Properties ---
const dialogTitle = computed(() => (isEditMode.value ? '编辑运动详情' : '新增运动详情'));
const totalPages = computed(() => Math.ceil(total.value / searchModel.pageSize));

// --- Validation Logic ---
const validateForm = (): boolean => {
    clearFormErrors();
    let isValid = true;
    // Required fields
    if (!detailForm.sportType?.trim()) {
        formErrors.sportType = '运动类型不能为空';
        isValid = false;
    }
    if (!detailForm.method?.trim()) {
        formErrors.method = '运动方法不能为空';
        isValid = false;
    }
    // Optional fields validation (e.g., length limits) can be added here if needed

    return isValid;
};

const clearFormErrors = () => {
    // Use 'as' to cast keys if TypeScript complains about index signature
    (Object.keys(formErrors) as Array<keyof typeof formErrors>).forEach(key => {
        formErrors[key] = '';
    });
    saveMessage.value = null;
};

// --- API Methods ---
const getDetailList = async () => {
    listLoading.value = true;
    saveMessage.value = null;
    try {
        const response = await sportItemManageApi.getDetailList(searchModel);
        if (response && response.data && Array.isArray(response.data.rows)) {
            detailList.value = response.data.rows;
            total.value = response.data.total;
        } else {
            console.error("Unexpected response structure from getDetailList:", response);
            detailList.value = [];
            total.value = 0;
            saveMessage.value = { type: 'error', text: '获取运动详情列表失败: 响应格式错误' };
        }
    } catch (error) {
        console.error("Error fetching detail list:", error);
        detailList.value = [];
        total.value = 0;
        saveMessage.value = { type: 'error', text: `获取运动详情列表失败: ${error instanceof Error ? error.message : '未知错误'}` };
    } finally {
        listLoading.value = false;
    }
};

const openDialog = async (id?: number) => {
    clearFormErrors();
    if (id) {
        isEditMode.value = true;
        try {
            const response = await sportItemManageApi.getDetailById(id);
            const formData = response.data as Detail;
            if (formData && typeof formData === 'object' && 'id' in formData) {
                Object.assign(detailForm, formData);
            } else {
                throw new Error("获取的运动详情格式无效");
            }
        } catch (error) {
            console.error("Error fetching detail by ID:", error);
            saveMessage.value = { type: 'error', text: `获取运动详情失败: ${error instanceof Error ? error.message : '未知错误'}` };
            return;
        }
    } else {
        isEditMode.value = false;
        Object.assign(detailForm, {
            id: undefined,
            sportType: '',
            disease: '',
            method: '',
            notes: ''
        });
    }
    dialogFormVisible.value = true;
};

const closeDialog = () => {
    dialogFormVisible.value = false;
};

const saveDetail = async () => {
    if (!validateForm()) {
        return;
    }
    saveLoading.value = true;
    saveMessage.value = null;
    try {
        if (isEditMode.value && detailForm.id) {
            await sportItemManageApi.updateDetail(detailForm as Detail);
            saveMessage.value = { type: 'success', text: '运动详情更新成功' };
        } else {
            const { id, ...addData } = detailForm;
            await sportItemManageApi.addDetail(addData as Omit<Detail, 'id'>);
            saveMessage.value = { type: 'success', text: '运动详情添加成功' };
        }
        closeDialog();
        await getDetailList();
    } catch (error) {
        console.error("Save detail error:", error);
        saveMessage.value = { type: 'error', text: `操作失败: ${error instanceof Error ? error.message : '未知错误'}` };
    } finally {
        saveLoading.value = false;
    }
};

const deleteDetail = async (detail: Detail) => {
    if (window.confirm(`确定要删除运动类型【${detail.sportType}】的详情吗？`)) {
        listLoading.value = true;
        saveMessage.value = null;
        try {
            await sportItemManageApi.deleteDetailById(detail.id);
            saveMessage.value = { type: 'success', text: '运动详情删除成功' };
            if (detailList.value.length === 1 && searchModel.pageNo > 1) {
                searchModel.pageNo--;
            }
            await getDetailList();
        } catch (error) {
            console.error("Delete detail error:", error);
            saveMessage.value = { type: 'error', text: `删除失败: ${error instanceof Error ? error.message : '未知错误'}` };
            listLoading.value = false;
        }
    }
};

// --- UI Methods ---
const resetSearch = () => {
    searchModel.sportType = '';
    searchModel.pageNo = 1;
    getDetailList();
};

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        searchModel.pageNo = page;
        getDetailList();
    }
};

// --- Lifecycle Hooks ---
onMounted(() => {
    getDetailList();
});

</script>

<style scoped>
/* Add any specific scoped styles if needed */
.sport-detail-manage-container :deep(textarea) {
    min-height: 80px; /* Adjust min height for textareas */
}
</style>
