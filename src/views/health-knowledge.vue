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
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-500 h-[320px] relative"
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

<script lang="ts">
// 导入APIs
import { getAllSportInfo, getSportList, getDetailInfoByName } from '../services/health'

export default {
  name: 'HealthKnowledge',
  data() {
    return {
      // 列表数据
      sportsList: [],
      totalRecords: 0,

      // 搜索和筛选
      searchQuery: '',
      categoryFilter: '',
      categories: [],

      // 分页
      currentPage: 1,
      pageSize: 9,

      // 状态
      loading: false,
      error: '',

      // 其他
      searchTimeout: null
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalRecords / this.pageSize)
    },

    paginationArray() {
      const pages = [];
      const maxPages = 5; // 最多显示5个页码
      let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
      const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

      if (endPage - startPage + 1 < maxPages) {
        startPage = Math.max(1, endPage - maxPages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    }
  },

  created() {
    this.fetchSportsList();
  },

  methods: {
    // 获取运动知识列表
    async fetchSportsList() {
      try {
        this.loading = true;
        this.error = '';

        let response;
        if (this.categoryFilter) {
          response = await getSportList(this.categoryFilter, this.currentPage, this.pageSize);
        } else {
          response = await getAllSportInfo(this.currentPage, this.pageSize);
        }

        if (response && response.data) {
          let sportItems = [];

          // 检查返回的数据结构
          if (response.data.records) {
            // 如果返回的是records属性
            sportItems = response.data.records || [];
            this.totalRecords = response.data.total || 0;
          } else if (response.data.rows) {
            // 如果返回的是rows属性
            sportItems = response.data.rows || [];
            this.totalRecords = response.data.total || 0;
          } else if (Array.isArray(response.data)) {
            // 如果直接返回数组
            sportItems = response.data;
            this.totalRecords = response.data.length;
          } else {
            console.error('未知的响应数据格式:', response.data);
            this.totalRecords = 0;
          }

          // 处理数据，添加翻转和详情属性
          this.sportsList = sportItems.map(sport => ({
            ...sport,
            flipped: false,
            detailLoading: false,
            detail: null
          }));

          // 提取所有运动类型作为分类
          if (this.sportsList.length > 0 && this.categories.length === 0) {
            const uniqueCategories = [...new Set(this.sportsList.map(sport => sport.sportType))];
            this.categories = uniqueCategories;
          }
        }
      } catch (err) {
        console.error('获取运动知识失败:', err);
        this.error = '获取运动知识列表失败，请稍后重试';
        this.sportsList = [];
      } finally {
        this.loading = false;
      }
    },

    // 切换卡片翻转状态并加载详情
    async toggleCardFlip(sport) {
      // 翻转卡片状态
      sport.flipped = !sport.flipped;

      // 如果是翻转到背面且还没有加载过详情，则加载详情
      if (sport.flipped && !sport.detail && !sport.detailLoading) {
        await this.fetchSportDetail(sport);
      }
    },

    // 根据运动类型获取详细信息
    async fetchSportDetail(sport) {
      try {
        // 设置加载状态
        sport.detailLoading = true;
        console.log('获取运动详情:', sport.sportType);

        const response = await getDetailInfoByName(sport.sportType);
        console.log('获取运动详情API响应:', response);

        if (response && response.data) {
          // 检查响应中是否包含必要的详情字段
          if (response.data.method || response.data.disease || response.data.notes) {
            sport.detail = response.data;
          } else if (response.data.id) {
            // 如果没有详情字段但有ID，可能是其他格式的响应
            sport.detail = {
              id: response.data.id,
              sportType: sport.sportType,
              method: response.data.method || '暂无相关信息',
              disease: response.data.disease || '暂无相关信息',
              notes: response.data.notes || '暂无相关信息'
            };
          } else {
            // 未返回有效数据
            sport.detail = {
              sportType: sport.sportType,
              method: '暂无相关信息',
              disease: '暂无相关信息',
              notes: '暂无相关信息'
            };
          }
        } else {
          // 没有响应或响应中没有data
          sport.detail = {
            sportType: sport.sportType,
            method: '暂无相关信息',
            disease: '暂无相关信息',
            notes: '暂无相关信息'
          };
        }
      } catch (err) {
        console.error('获取运动详情失败:', err);
        // 错误时也显示默认数据而不是空白
        sport.detail = {
          sportType: sport.sportType,
          method: '获取详情失败，请稍后重试',
          disease: '获取详情失败，请稍后重试',
          notes: '获取详情失败，请稍后重试'
        };
        this.error = '获取运动详情失败，但已显示占位内容';
      } finally {
        sport.detailLoading = false;
      }
    },

    // 处理搜索
    handleSearch() {
      // 防抖
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchSportsList();
      }, 500);
    },

    // 处理分类筛选
    handleFilterChange() {
      this.currentPage = 1;
      this.fetchSportsList();
    },

    // 重置筛选
    resetFilters() {
      this.searchQuery = '';
      this.categoryFilter = '';
      this.currentPage = 1;
      this.fetchSportsList();
    },

    // 切换页码
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchSportsList();
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

/* 卡片动画效果 */
.grid>div {
  animation: fadeIn 0.3s ease-out forwards;
}

.grid>div:nth-child(3n+1) {
  animation-delay: 0.1s;
}

.grid>div:nth-child(3n+2) {
  animation-delay: 0.2s;
}

.grid>div:nth-child(3n+3) {
  animation-delay: 0.3s;
}
</style>
