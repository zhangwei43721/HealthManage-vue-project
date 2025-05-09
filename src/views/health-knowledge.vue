<template>
  <div class="health-knowledge min-h-screen pb-16 pt-24 dark:bg-gray-900 dark:text-white">
    <!-- 加载状态 -->
    <div v-if="loading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75">
      <div class="text-center">
        <svg class="animate-spin h-10 w-10 mx-auto mb-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="text-lg font-medium text-gray-700 dark:text-gray-300">加载健康知识库...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="fixed inset-x-0 top-20 z-50 flex justify-center">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md flex items-center shadow-lg">
        <svg class="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-medium">获取数据失败</p>
          <p class="text-sm">{{ error }}</p>
        </div>
        <button @click="error = ''" class="ml-auto">
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">健康知识库</h1>
        <p class="mt-3 text-xl text-gray-500 dark:text-gray-400">探索各类运动知识与健康生活方式</p>
      </div>

      <!-- 搜索和筛选区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="搜索运动类型..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <select v-model="categoryFilter" @change="handleFilterChange"
              class="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">所有运动类型</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 运动知识列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="sport in sportsList" :key="sport.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform h-[320px] relative"
          :class="{ 'cursor-pointer hover:shadow-lg hover:scale-[1.02]': !sport.flipped }"
          @click="toggleCardFlip(sport)">
          <!-- 卡片正面 (基本信息) -->
          <div class="p-6 h-full" v-show="!sport.flipped">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <span
                class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-500 mr-3">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clip-rule="evenodd" />
                </svg>
              </span>
              {{ sport.sportType }}
            </h3>

            <div class="mt-4 space-y-2">
              <div class="flex">
                <span class="text-gray-500 dark:text-gray-400 font-medium w-24">适宜时长：</span>
                <span class="text-gray-700 dark:text-gray-300">{{ sport.suitableTime }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-500 dark:text-gray-400 font-medium w-24">适宜心率：</span>
                <span class="text-gray-700 dark:text-gray-300">{{ sport.suitableHeartRate }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-500 dark:text-gray-400 font-medium w-24">建议频率：</span>
                <span class="text-gray-700 dark:text-gray-300">{{ sport.suitableFrequency }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-500 dark:text-gray-400 font-medium w-24">建议速度：</span>
                <span class="text-gray-700 dark:text-gray-300">{{ sport.recommendedSpeed }}</span>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button
                class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                查看详情 →
              </button>
            </div>
          </div>

          <!-- 卡片背面 (详细信息) -->
          <div class="p-4 h-full bg-white dark:bg-gray-800 absolute inset-0 transition-all duration-300"
            :class="{ 'opacity-0 pointer-events-none': !sport.flipped, 'opacity-100': sport.flipped }"
            v-if="sport.flipped">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ sport.sportType }}</h3>
              <button @click.stop="toggleCardFlip(sport)"
                class="p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div v-if="sport.detailLoading" class="h-full flex items-center justify-center">
              <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
            </div>

            <div v-else-if="sport.detail" class="overflow-y-auto h-[260px] pr-1 space-y-3">
              <div class="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                <h4 class="font-medium text-indigo-700 dark:text-indigo-400 text-sm mb-1">运动方法</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">{{ sport.detail.method }}</p>
              </div>

              <div class="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                <h4 class="font-medium text-red-700 dark:text-red-400 text-sm mb-1">适宜/禁忌疾病</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">{{ sport.detail.disease }}</p>
              </div>

              <div class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                <h4 class="font-medium text-yellow-700 dark:text-yellow-400 text-sm mb-1">注意事项</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">{{ sport.detail.notes }}</p>
              </div>
            </div>

            <div v-else class="h-full flex items-center justify-center">
              <p class="text-center text-gray-500 dark:text-gray-400">未找到详情信息</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="sportsList.length === 0 && !loading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">未找到相关结果</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">尝试修改搜索条件或清除筛选器。</p>
        <div class="mt-6">
          <button @click="resetFilters"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            清除筛选
          </button>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="flex justify-center mt-8">
        <nav class="inline-flex rounded-md shadow">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" :class="[
            'px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
          ]">
            上一页
          </button>
          <button v-for="page in paginationArray" :key="page" @click="changePage(page)" :class="[
            'px-4 py-2 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            currentPage === page ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
          ]">
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" :class="[
            'px-4 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
          ]">
            下一页
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// 导入APIs
import { getAllSportInfo, getSportList, getDetailInfoByName } from '../services/health'

interface SportDetail {
  id?: number;
  sportType?: string;
  method: string;
  disease: string;
  notes: string;
}

interface ApiSportItem {
  id: number;
  sportType: string;
  suitableTime?: string;
  suitableHeartRate?: string;
  suitableFrequency?: string;
  recommendedSpeed?: string;
}

interface SportListItem extends ApiSportItem {
  flipped: boolean;
  detailLoading: boolean;
  detail: SportDetail | null;
}

interface ApiResponse {
  data?: {
    records?: ApiSportItem[];
    rows?: ApiSportItem[];
    total?: number;
  } | ApiSportItem[];
}

const sportsList = ref<SportListItem[]>([]);
const totalRecords = ref<number>(0);

const searchQuery = ref<string>('');
const categoryFilter = ref<string>('');
const categories = ref<string[]>([]); // Assuming categories are strings

const currentPage = ref<number>(1);
const pageSize = ref<number>(9);

const loading = ref<boolean>(false);
const error = ref<string>('');

const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const totalPages = computed<number>(() => {
  return Math.ceil(totalRecords.value / pageSize.value)
});

const paginationArray = computed<number[]>(() => {
  const pages: number[] = [];
  const maxPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxPages - 1);

  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

onMounted(() => {
  fetchSportsList();
});

// --- Functions ---
// 获取运动知识列表
const fetchSportsList = async () => {
  try {
    loading.value = true;
    error.value = '';

    let apiResponsePayload; // Renamed from 'response' to avoid confusion with fetch's Response
    if (categoryFilter.value) {
      apiResponsePayload = await getSportList(categoryFilter.value, currentPage.value, pageSize.value); // from health.ts
    } else {
      apiResponsePayload = await getAllSportInfo(currentPage.value, pageSize.value); // from health.ts
    }

    // apiResponsePayload is now expected to be { records?, rows?, total? } directly
    if (apiResponsePayload && typeof apiResponsePayload === 'object') {
      let sportItems: ApiSportItem[] = []; // Type from component

      if (apiResponsePayload.records && Array.isArray(apiResponsePayload.records)) {
        sportItems = apiResponsePayload.records || [];
        totalRecords.value = apiResponsePayload.total || 0;
      } else if (apiResponsePayload.rows && Array.isArray(apiResponsePayload.rows)) {
        sportItems = apiResponsePayload.rows || [];
        totalRecords.value = apiResponsePayload.total || 0;
      } else if (Array.isArray(apiResponsePayload)) {
        // Handle case where API directly returns an array (no total)
        // This path might not be hit if backend is consistent with {rows/records, total}
        sportItems = apiResponsePayload;
        totalRecords.value = apiResponsePayload.length;
        console.warn('getAllSportInfo/getSportList returned a direct array. Total inferred from length.');
      } else {
         console.error('Unknown response data structure (expected {records/rows, total} or array):', apiResponsePayload);
         sportItems = []; // Ensure sportItems is an array
         totalRecords.value = 0; // Reset on unknown structure
      }

      sportsList.value = sportItems.map((sport: ApiSportItem): SportListItem => ({
        id: sport.id ?? 0,
        sportType: sport.sportType ?? '未知类型',
        suitableTime: sport.suitableTime ?? 'N/A',
        suitableHeartRate: sport.suitableHeartRate ?? 'N/A',
        suitableFrequency: sport.suitableFrequency ?? 'N/A',
        recommendedSpeed: sport.recommendedSpeed ?? 'N/A',
        flipped: false,
        detailLoading: false,
        detail: null
      }));

      if (sportsList.value.length > 0 && categories.value.length === 0) {
        const uniqueCategories = [
          ...new Set(sportsList.value.map((sport: SportListItem) => sport.sportType))
        ];
        categories.value = uniqueCategories.filter(cat => cat !== '未知类型');
      }
    } else {
      // Handle case where apiResponsePayload is null, undefined, or not an object
      console.error('Invalid or empty response from sport API:', apiResponsePayload);
      sportsList.value = [];
      totalRecords.value = 0;
    }
  } catch (err) {
    console.error('获取运动知识失败:', err);
    error.value = '获取运动知识列表失败，请稍后重试';
    sportsList.value = [];
    totalRecords.value = 0;
  } finally {
    loading.value = false;
  }
};

// 根据运动类型获取详细信息
const fetchSportDetail = async (sport: SportListItem) => {
  // Don't fetch if already loading or detail exists
  if (sport.detailLoading || sport.detail) return;

  try {
    sport.detailLoading = true;
    console.log('获取运动详情:', sport.sportType);

    // Assuming getDetailInfoByName returns Promise<{ data: SportDetail | null }>
    const response = await getDetailInfoByName(sport.sportType);
    console.log('获取运动详情API响应:', response);

    if (response && response.data && (response.data.method || response.data.disease || response.data.notes)) {
      sport.detail = response.data;
    } else {
      // Provide default placeholder if no valid detail found
      sport.detail = {
        method: '暂无相关运动方法信息',
        disease: '暂无相关适宜/禁忌疾病信息',
        notes: '暂无相关注意事项信息'
      };
      console.warn('运动详情数据不完整或未找到:', sport.sportType, response?.data);
    }
  } catch (err) {
    console.error('获取运动详情失败:', err);
    sport.detail = {
      method: '获取详情失败，请稍后重试',
      disease: '获取详情失败，请稍后重试',
      notes: '获取详情失败，请稍后重试'
    };
    error.value = '获取运动详情失败'; // Update general error state
  } finally {
    sport.detailLoading = false;
  }
};

// 切换卡片翻转状态并加载详情
const toggleCardFlip = (sport: SportListItem) => {
  sport.flipped = !sport.flipped;
  // Fetch detail only when flipping to the back side
  if (sport.flipped) {
    fetchSportDetail(sport);
  }
};

// 处理搜索 (with debounce)
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1; // Reset page on new search
    fetchSportsList();
  }, 500); // 500ms debounce
};

// 处理分类筛选
const handleFilterChange = () => {
  currentPage.value = 1; // Reset page on filter change
  fetchSportsList();
};

// 重置筛选
const resetFilters = () => {
  searchQuery.value = '';
  categoryFilter.value = '';
  currentPage.value = 1;
  fetchSportsList();
};

// 切换页码
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  currentPage.value = page;
  fetchSportsList();
};
</script>

<style scoped>
.health-knowledge {
  background-color: #f9fafb;
}

.dark .health-knowledge {
  background-color: #111827;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
