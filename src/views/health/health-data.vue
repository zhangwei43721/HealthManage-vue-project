<template>
  <div class="health-dashboard min-h-screen pb-20 pt-24 dark:bg-gray-900 dark:text-white">
    <div v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75">
      <div class="text-center">
        <svg class="animate-spin h-10 w-10 mx-auto mb-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        <p class="text-lg font-medium text-gray-700 dark:text-gray-300">加载您的健康数据...</p>
      </div>
    </div>

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
        <button @click="retryDataFetch" class="ml-2 text-sm font-medium text-red-700 hover:text-red-900 underline">
          重试
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">健康数据中心</h1>
        <p class="mt-3 text-xl text-gray-500 dark:text-gray-400">全面了解您的健康状况和历史变化</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          style="height: 300px">
          <div class="p-6 flex flex-col items-center justify-center h-full relative">
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :stop-color="healthIndexColor" />
                  <stop offset="100%" :stop-color="healthGradientEndColor" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" stroke-width="10"
                class="dark:stroke-gray-700" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="url(#healthGradient)" stroke-width="10"
                stroke-dasharray="251.2" :stroke-dashoffset="251.2 * (1 - healthIndex / 100)"
                transform="rotate(-90 50 50)">
                <animate attributeName="stroke-dashoffset" :from="251.2" :to="251.2 * (1 - healthIndex / 100)"
                  dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.42 0 0.58 1" />
              </circle>
            </svg>
            <div class="relative z-10 flex flex-col items-center">
              <span class="text-5xl font-bold"
                :style="`background: linear-gradient(to right, ${healthIndexColor}, ${healthGradientEndColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`">{{
                  healthIndex }}%</span>
              <span class="text-gray-600 dark:text-gray-300 mt-2 text-lg font-medium">健康指数</span>
              <div class="mt-3 text-sm font-medium" :class="healthIndexClass">{{ healthIndexText }}</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z">
                </path>
              </svg>
              身体数据
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div v-for="item in bodyDataItems" :key="item.label"
                class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="flex flex-col items-center justify-center h-36">
                  <div class="text-center">
                    <div class="text-lg text-gray-700 dark:text-gray-300 mb-2">{{ item.label }}</div>
                    <div class="flex items-baseline">
                      <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ item.value }}</span>
                      <span v-if="item.unit" class="ml-1 text-gray-500 dark:text-gray-400 text-sm">{{ item.unit
                      }}</span>
                    </div>
                    <div v-if="item.comment" class="mt-2 text-sm" :class="item.commentClass">{{ item.comment }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            生命体征
          </h2>
          <div class="space-y-6">
            <div v-for="vital in vitalSignsConfig" :key="vital.key"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <div class="flex items-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ vital.label }}</span>
                  <div class="relative ml-2 group">
                    <svg class="w-4 h-4 text-gray-400 cursor-help" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4M12 8h.01"></path>
                    </svg>
                    <div
                      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                      正常范围: {{ vital.ranges.normalMin }} - {{ vital.ranges.normalMax }} {{ vital.unit }}
                    </div>
                  </div>
                </div>
                <span class="text-sm font-medium mt-1 md:mt-0"
                  :class="getVitalStatus(vital.value, vital.ranges).textClass">
                  {{ vital.value }} {{ vital.unit }}
                  <span v-if="getVitalStatus(vital.value, vital.ranges).status === 'normal'"
                    class="inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">(正常)</span>
                  <span v-else-if="getVitalStatus(vital.value, vital.ranges).status === 'high'"
                    class="inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">(偏高)</span>
                  <span v-else-if="getVitalStatus(vital.value, vital.ranges).status === 'low'"
                    class="inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">(偏低)</span>
                </span>
              </div>
              <div class="relative h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="absolute top-0 left-0 h-full rounded-full"
                  :class="getVitalStatus(vital.value, vital.ranges).progressClass"
                  :style="`width: ${calculateProgress(vital.value, vital.progressMax)}%; transition: width 1s ease-in-out;`">
                </div>
              </div>
              <div class="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{{ vital.ranges.dangerLow }}</span>
                <span class="text-green-500">{{ vital.ranges.normalMin }} - {{ vital.ranges.normalMax }}</span>
                <span>{{ vital.ranges.dangerHigh }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
              健康评估分数
            </h2>
            <div ref="scoreChartContainer" class="h-72 w-full"></div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <path d="M21 12h-4l-3 8-4-16-3 8H3"></path>
              </svg>
              健康趋势综合图
            </h2>
            <div ref="chartContainer" class="h-80 w-full"></div>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            健康建议
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(recommendation, index) in healthRecommendations" :key="index"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="recommendation.bgClass">
                    <svg class="w-5 h-5" :class="recommendation.iconClass" xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path :d="recommendation.iconPath"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-base font-medium text-gray-900 dark:text-white">{{ recommendation.title }}</h3>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ recommendation.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from '../../composables/vue-imports.ts'
import { getUserBodyInfo as getUserInfo, getHistoricalData } from '../../services/health.ts';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent,
  MarkLineComponent, MarkPointComponent, ToolboxComponent, AxisPointerComponent, VisualMapComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import type { EChartsOption } from 'echarts';

echarts.use([
  TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, MarkLineComponent,
  MarkPointComponent, ToolboxComponent, AxisPointerComponent, VisualMapComponent, LineChart, BarChart,
  CanvasRenderer, UniversalTransition
]);

interface HistoricalRecord {
  id: number; notesid: number; name: string; age: number; gender: string; height: number; weight: number;
  bloodSugar: number; bloodPressure: string; bloodLipid: string; heartRate: number; vision: number;
  sleepDuration: number; sleepQuality: string; smoking: boolean; drinking: boolean; exercise: boolean;
  foodTypes: string; waterConsumption: number; date: number;
}

interface ScoreItem {
  name: string;
  score: number;
}

interface BodyDataType {
  id: number; name: string; age: number; gender: string; height: number; weight: number;
  bloodSugar: number; bloodPressure: string; bloodLipid: string; heartRate: number; vision: number;
  sleepDuration: number; sleepQuality: string; smoking: boolean; drinking: boolean; exercise: boolean;
  foodTypes: string; waterConsumption: number;
}

interface VitalRanges {
  normalMin: number; normalMax: number;
  warningLow?: number; warningHigh?: number;
  dangerLow: number; dangerHigh: number;
}

interface VitalStatus {
  status: 'normal' | 'warning' | 'danger' | 'low' | 'high';
  textClass: string;
  progressClass: string;
}


const bodyData = ref<BodyDataType>({
  id: 0, name: '加载中...', age: 0, gender: '男', height: 0, weight: 0, bloodSugar: 0,
  bloodPressure: '0', bloodLipid: '0', heartRate: 0, vision: 0, sleepDuration: 0,
  sleepQuality: '', smoking: false, drinking: false, exercise: false, foodTypes: '', waterConsumption: 0
});

const historyData = ref<HistoricalRecord[]>([]);
const chartContainer = ref<HTMLElement | null>(null);
const scoreChartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let scoreChartInstance: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;
let scoreResizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;

const isLoading = ref(true);
const error = ref('');

const bmi = computed(() => {
  if (!bodyData.value.height || !bodyData.value.weight) return 0;
  const heightInMeters = bodyData.value.height / 100;
  return bodyData.value.weight / (heightInMeters * heightInMeters);
});

const bodyDataItems = computed(() => [
  {
    label: '身高',
    value: bodyData.value.height,
    unit: 'cm',
    comment: '',
    commentClass: ''
  },
  {
    label: '体重',
    value: bodyData.value.weight,
    unit: 'kg',
    comment: '',
    commentClass: ''
  },
  {
    label: 'BMI',
    value: bmi.value.toFixed(1),
    unit: '',
    comment: getBmiComment(bmi.value),
    commentClass: getBmiCommentClass(bmi.value)
  }
]);

const calculateScore = (value: number, normalMin: number, normalMax: number, lowPenaltyFactor = 1, highPenaltyFactor = 1): number => {
  if (value >= normalMin && value <= normalMax) return 100;
  const deviation = value < normalMin ? (normalMin - value) * lowPenaltyFactor : (value - normalMax) * highPenaltyFactor;
  return Math.max(0, 100 - deviation);
};

const detailedScores = computed(() => {
  const data = bodyData.value;
  const bmiValue = bmi.value;
  const bpValue = parseInt(data.bloodPressure);
  const lipidValue = parseFloat(data.bloodLipid);

  const scores = {
    bmiScore: calculateScore(bmiValue, 18.5, 24.9, 10, 5),
    bloodSugarScore: calculateScore(data.bloodSugar, 4, 6, 20, 15),
    bloodPressureScore: calculateScore(bpValue, 90, 120, 2, 1.5),
    heartRateScore: calculateScore(data.heartRate, 60, 100, 2, 1.5),
    lifestyleScore: 100 - (data.smoking ? 20 : 0) - (data.drinking ? 10 : 0) + (data.exercise ? 10 : 0),
    bloodLipidScore: calculateScore(lipidValue, 2.8, 5.2, 15, 10)
  };
  return {
    bmiScore: Math.round(Math.max(0, Math.min(100, scores.bmiScore))),
    bloodSugarScore: Math.round(Math.max(0, Math.min(100, scores.bloodSugarScore))),
    bloodPressureScore: Math.round(Math.max(0, Math.min(100, scores.bloodPressureScore))),
    heartRateScore: Math.round(Math.max(0, Math.min(100, scores.heartRateScore))),
    lifestyleScore: Math.round(Math.max(0, Math.min(100, scores.lifestyleScore))),
    bloodLipidScore: Math.round(Math.max(0, Math.min(100, scores.bloodLipidScore)))
  };
});

const healthIndex = computed(() => {
  if (!bodyData.value.id) return 0;
  const scores = detailedScores.value;
  const total = (
    scores.bmiScore * 2 +
    scores.bloodSugarScore * 2 +
    scores.bloodPressureScore * 2 +
    scores.heartRateScore * 2 +
    scores.lifestyleScore * 2 +
    scores.bloodLipidScore * 2
  ) / 12;
  return Math.round(Math.max(0, Math.min(100, total)));
});

const healthIndexColor = computed(() => {
  const index = healthIndex.value;
  if (index >= 80) return '#10b981';
  if (index >= 60) return '#f59e0b';
  return '#ef4444';
});

const healthScoresChartData = computed(() => {
  const scores = detailedScores.value;
  return [
    { name: 'BMI', score: scores.bmiScore },
    { name: '血糖', score: scores.bloodSugarScore },
    { name: '血压', score: scores.bloodPressureScore },
    { name: '心率', score: scores.heartRateScore },
    { name: '生活方式', score: scores.lifestyleScore },
    { name: '血脂', score: scores.bloodLipidScore }
  ];
});

const getVitalStatus = (value: number, ranges: VitalRanges): VitalStatus => {
  if (value >= ranges.normalMin && value <= ranges.normalMax) {
    return { status: 'normal', textClass: 'text-green-600 dark:text-green-400', progressClass: 'bg-green-500' };
  } else if (value < ranges.dangerLow || value > ranges.dangerHigh) {
    const status = value < ranges.dangerLow ? 'low' : 'high';
    return { status: status, textClass: 'text-red-600 dark:text-red-400', progressClass: 'bg-red-500' };
  } else {
    const status = value < ranges.normalMin ? 'low' : 'high';
    return { status: status, textClass: 'text-yellow-600 dark:text-yellow-400', progressClass: 'bg-yellow-500' };
  }
};

const vitalSignsConfig = computed(() => {
  const data = bodyData.value;
  const bpValue = parseInt(data.bloodPressure);
  const lipidValue = parseFloat(data.bloodLipid);

  return [
    { key: 'bloodSugar', label: '血糖', value: data.bloodSugar, unit: 'mmol/L', progressMax: 10, ranges: { normalMin: 4, normalMax: 6, dangerLow: 3, dangerHigh: 7 } },
    { key: 'bloodLipid', label: '血脂', value: lipidValue, unit: 'mmol/L', progressMax: 10, ranges: { normalMin: 2.8, normalMax: 5.2, dangerLow: 2, dangerHigh: 6 } },
    { key: 'bloodPressure', label: '血压', value: bpValue, unit: 'mmHg', progressMax: 200, ranges: { normalMin: 90, normalMax: 120, dangerLow: 80, dangerHigh: 140 } },
    { key: 'heartRate', label: '心率', value: data.heartRate, unit: 'bpm', progressMax: 150, ranges: { normalMin: 60, normalMax: 100, dangerLow: 40, dangerHigh: 120 } },
  ];
});

const calculateProgress = (value: number, max: number) => {
  return Math.min((value / max) * 100, 100);
};

const getScoreHexColor = (score: number): string => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const updateChartOptions = () => {
  if (!chartInstance || !historyData.value || historyData.value.length === 0) return;

  const sortedData = [...historyData.value].sort((a, b) => a.date - b.date);
  const dates = sortedData.map(item => formatDate(item.date));
  const isDarkMode = document.documentElement.classList.contains('dark');

  const seriesConfigs = [
    { name: '血压', key: 'bloodPressure', unit: 'mmHg', color: '#3b82f6', yAxisIndex: 0, parser: (v: string | number) => parseFloat(String(v || '0')) },
    { name: '血糖', key: 'bloodSugar', unit: 'mmol/L', color: '#f59e0b', yAxisIndex: 1, parser: (v: string | number) => parseFloat(String(v || '0')) },
    { name: '心率', key: 'heartRate', unit: 'bpm', color: '#10b981', yAxisIndex: 2, parser: (v: string | number) => parseFloat(String(v || '0')) },
    { name: '血脂', key: 'bloodLipid', unit: 'mmol/L', color: '#ec4899', yAxisIndex: 3, parser: (v: string | number) => parseFloat(String(v || '0')) }
  ];

  const option: EChartsOption = {
    darkMode: isDarkMode,
    backgroundColor: isDarkMode ? 'transparent' : 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: isDarkMode ? 'rgba(50,50,50,0.9)' : 'rgba(255,255,255,0.9)',
      borderColor: isDarkMode ? '#555' : '#ddd',
      textStyle: { color: isDarkMode ? '#eee' : '#333' }
    },
    legend: {
      data: seriesConfigs.map(s => s.name),
      textStyle: { color: isDarkMode ? '#ccc' : '#333' },
      selectedMode: 'multiple',
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 20,
      borderRadius: 2
    },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    toolbox: {
      feature: {
        saveAsImage: {
          name: '健康趋势图',
          title: '保存为图片',
          iconStyle: { borderColor: isDarkMode ? '#ddd' : '#666' }
        },
        restore: { title: '还原' },
        dataZoom: { title: { zoom: '区域缩放', back: '区域缩放还原' } },
        dataView: { title: '数据视图', lang: ['数据视图', '关闭', '刷新'] }
      },
      iconStyle: { borderColor: isDarkMode ? '#ddd' : '#666' }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: isDarkMode ? '#555' : '#ccc' } },
      axisLabel: {
        color: isDarkMode ? '#ccc' : '#333',
        rotate: dates.length > 10 ? 45 : 0,
        fontSize: 11
      },
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: seriesConfigs.map((s, i) => ({
      type: 'value',
      name: `${s.name}(${s.unit})`,
      position: i % 2 === 0 ? 'left' : 'right',
      offset: i > 1 ? 60 : 0,
      alignTicks: true,
      axisLine: { show: true, lineStyle: { color: s.color } },
      axisLabel: { formatter: '{value}', color: isDarkMode ? '#ccc' : '#333' },
      splitLine: {
        show: i === 0,
        lineStyle: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          type: 'dashed'
        }
      }
    })),
    series: seriesConfigs.map(s => ({
      name: s.name,
      type: 'line',
      yAxisIndex: s.yAxisIndex,
      smooth: true,
      data: sortedData.map(item => s.parser(item[s.key as keyof HistoricalRecord])),
      itemStyle: { color: s.color },
      lineStyle: {
        color: s.color,
        width: 3,
        shadowColor: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)',
        shadowBlur: 5
      },
      symbol: 'circle',
      symbolSize: 8,
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 2,
          borderColor: '#fff',
          shadowBlur: 10,
          shadowColor: s.color
        }
      },
      showSymbol: false
    })),
    dataZoom: [
      { type: 'inside', start: 0, end: 100 },
      {
        start: 0,
        end: 100,
        handleSize: '80%',
        bottom: 10,
        height: 15,
        borderColor: isDarkMode ? '#777' : '#ddd',
        textStyle: { color: isDarkMode ? '#ccc' : '#333' },
        fillerColor: isDarkMode ? 'rgba(120,120,120,0.2)' : 'rgba(200,200,200,0.2)'
      }
    ],
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut'
  };
  chartInstance.setOption(option);
};

const initChart = () => {
  if (chartContainer.value) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    chartInstance = echarts.init(chartContainer.value, isDarkMode ? 'dark' : undefined);
    updateChartOptions();
    resizeObserver = new ResizeObserver(() => chartInstance?.resize());
    resizeObserver.observe(chartContainer.value);
  }
};

const updateScoreChartOptions = () => {
  if (!scoreChartInstance || !healthScoresChartData.value || healthScoresChartData.value.length === 0) return;

  const scoresData = healthScoresChartData.value;
  const categoryData = scoresData.map((item: ScoreItem) => item.name);
  const seriesData = scoresData.map((item: ScoreItem) => item.score);
  const isDarkMode = document.documentElement.classList.contains('dark');

  const option: EChartsOption = {
    darkMode: isDarkMode,
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}分',
      backgroundColor: isDarkMode ? 'rgba(50,50,50,0.9)' : 'rgba(255,255,255,0.9)',
      borderColor: isDarkMode ? '#555' : '#ddd',
      textStyle: { color: isDarkMode ? '#eee' : '#333' },
      axisPointer: { type: 'shadow' }
    },
    grid: { top: '15%', left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: categoryData,
      axisLabel: {
        interval: 0,
        color: isDarkMode ? '#ccc' : '#5e6d82',
        rotate: seriesData.length > 5 ? 45 : 0
      },
      axisLine: { lineStyle: { color: isDarkMode ? '#555' : '#eee' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '评分',
      min: 0,
      max: 100,
      interval: 20,
      nameTextStyle: { color: isDarkMode ? '#ccc' : '#5e6d82' },
      axisLabel: { color: isDarkMode ? '#ccc' : '#5e6d82' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: isDarkMode ? '#333' : '#eee' } }
    },
    series: [{
      name: '评分',
      type: 'bar',
      barWidth: '40%',
      data: seriesData,
      itemStyle: {
        color: params => getScoreHexColor(params.value as number),
        borderRadius: [5, 5, 0, 0],
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 5
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}分',
        color: isDarkMode ? '#ddd' : '#666'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      },
      animationDelay: (idx: number) => idx * 200,
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx: number) => idx * 5,
  };
  scoreChartInstance.setOption(option);
};

const initScoreChart = () => {
  if (scoreChartContainer.value) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    scoreChartInstance = echarts.init(scoreChartContainer.value, isDarkMode ? 'dark' : undefined);
    updateScoreChartOptions();
    scoreResizeObserver = new ResizeObserver(() => scoreChartInstance?.resize());
    scoreResizeObserver.observe(scoreChartContainer.value);
  }
};

const observeThemeChange = () => {
  const targetNode = document.documentElement;
  const config = { attributes: true, attributeFilter: ['class'] };
  const callback = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'class') {
        chartInstance?.dispose();
        scoreChartInstance?.dispose();
        initChart();
        initScoreChart();
      }
    }
  };
  themeObserver = new MutationObserver(callback);
  themeObserver.observe(targetNode, config);
};

async function fetchUserHealthData() {
  try {
    isLoading.value = true;
    error.value = '';

    const response = await getUserInfo();
    if (response.data?.bodyList?.[0]) {
      bodyData.value = response.data.bodyList[0];
    } else {
      error.value = '未找到用户健康数据';
    }
  } catch (err) {
    console.error('获取健康数据失败:', err);
    error.value = '获取健康数据时发生错误，请稍后重试';
  }
}

async function fetchHistoryData() {
  try {
    if (!bodyData.value?.id) {
      console.warn('无法获取历史数据，用户 ID 未定义。');
      return;
    }

    const response = await getHistoricalData(bodyData.value.id);
    if (response.data && Array.isArray(response.data)) {
      historyData.value = response.data
        .filter((item: HistoricalRecord): item is HistoricalRecord => item?.date != null)
        .sort((a: HistoricalRecord, b: HistoricalRecord) => a.date - b.date);
    } else {
      historyData.value = [];
      console.warn('获取的历史数据格式不正确或为空:', response.data);
    }
    await nextTick();
    updateChartOptions();
  } catch (err) {
    console.error('获取历史数据失败:', err);
    error.value = '获取历史数据时发生错误，请稍后重试';
    historyData.value = [];
  } finally {
    isLoading.value = false;
  }
}

const retryDataFetch = async () => {
  error.value = '';
  await fetchUserHealthData();
  if (bodyData.value.id) {
    await fetchHistoryData();
  }
  await nextTick();
  initChart();
  initScoreChart();
};

onMounted(async () => {
  try {
    await fetchUserHealthData();
    if (bodyData.value.id) {
      await fetchHistoryData();
    } else {
      isLoading.value = false;
    }
    await nextTick();
    initChart();
    initScoreChart();
    observeThemeChange();
  } catch (err) {
    console.error('初始化页面失败:', err);
    error.value = '加载页面时发生错误，请刷新页面重试';
    isLoading.value = false;
  }
});

onUnmounted(() => {
  chartInstance?.dispose();
  scoreChartInstance?.dispose();
  if (chartContainer.value && resizeObserver) resizeObserver.unobserve(chartContainer.value);
  if (scoreChartContainer.value && scoreResizeObserver) scoreResizeObserver.unobserve(scoreChartContainer.value);
  themeObserver?.disconnect();
  resizeObserver = null;
  scoreResizeObserver = null;
  themeObserver = null;
});

watch(historyData, async () => {
  await nextTick();
  updateChartOptions();
}, { deep: true });

watch(bodyData, async (newData: BodyDataType) => {
  if (newData && newData.name !== '加载中...') {
    if (!historyData.value.length && newData.id) {
      await fetchHistoryData();
    }
    await nextTick();
    updateScoreChartOptions();
  }
}, { deep: true });

const getBmiComment = (bmiValue: number): string => {
  if (bmiValue < 18.5) return '体重偏轻';
  if (bmiValue < 24.9) return '体重正常';
  if (bmiValue < 29.9) return '体重过重';
  return '肥胖';
};

const getBmiCommentClass = (bmiValue: number): string => {
  if (bmiValue < 18.5) return 'text-yellow-500';
  if (bmiValue < 24.9) return 'text-green-500';
  if (bmiValue < 29.9) return 'text-yellow-500';
  return 'text-red-500';
};

const healthGradientEndColor = computed(() => {
  const index = healthIndex.value;
  if (index >= 80) return '#34d399';
  if (index >= 60) return '#fbbf24';
  return '#f87171';
});

const healthIndexText = computed(() => {
  const index = healthIndex.value;
  if (index >= 80) return '优秀';
  if (index >= 60) return '良好';
  return '需要改善';
});

const healthIndexClass = computed(() => {
  const index = healthIndex.value;
  if (index >= 80) return 'text-green-500';
  if (index >= 60) return 'text-yellow-500';
  return 'text-red-500';
});

const healthRecommendations = computed(() => {
  const recommendations = [];

  if (healthIndex.value < 60) {
    recommendations.push({
      title: '增加健康检查频率',
      description: '建议每3个月进行一次全面健康检查，重点关注您的薄弱项目。',
      iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      bgClass: 'bg-red-100 dark:bg-red-900',
      iconClass: 'text-red-600 dark:text-red-300'
    });
  }

  if (bmi.value < 18.5) {
    recommendations.push({
      title: '增加营养摄入',
      description: '您的BMI偏低，建议适当增加蛋白质和碳水化合物的摄入，保持健康饮食。',
      iconPath: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900',
      iconClass: 'text-yellow-600 dark:text-yellow-300'
    });
  } else if (bmi.value >= 24.9) {
    recommendations.push({
      title: '控制体重',
      description: '您的BMI偏高，建议增加有氧运动，减少高热量食物摄入，保持健康体重。',
      iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
      bgClass: 'bg-yellow-100 dark:bg-yellow-900',
      iconClass: 'text-yellow-600 dark:text-yellow-300'
    });
  }

  const bpValue = parseInt(bodyData.value.bloodPressure);
  if (bpValue > 120) {
    recommendations.push({
      title: '关注血压',
      description: '您的血压偏高，建议减少盐分摄入，坚持适度运动，避免过度紧张和压力。',
      iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      bgClass: 'bg-red-100 dark:bg-red-900',
      iconClass: 'text-red-600 dark:text-red-300'
    });
  }

  if (bodyData.value.bloodSugar > 6) {
    recommendations.push({
      title: '血糖管理',
      description: '您的血糖偏高，建议控制碳水化合物摄入，避免精制糖，增加纤维摄入。',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      bgClass: 'bg-orange-100 dark:bg-orange-900',
      iconClass: 'text-orange-600 dark:text-orange-300'
    });
  }

  if (bodyData.value.smoking || bodyData.value.drinking) {
    recommendations.push({
      title: '改善生活习惯',
      description: `建议${bodyData.value.smoking ? '戒烟' : ''}${bodyData.value.smoking && bodyData.value.drinking ? '、' : ''}${bodyData.value.drinking ? '限制酒精摄入' : ''}，养成健康生活方式。`,
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      bgClass: 'bg-purple-100 dark:bg-purple-900',
      iconClass: 'text-purple-600 dark:text-purple-300'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: '保持现状',
      description: '您的各项指标良好，建议保持当前的健康状态和生活习惯。',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      bgClass: 'bg-green-100 dark:bg-green-900',
      iconClass: 'text-green-600 dark:text-green-300'
    });
  }

  return recommendations;
});
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes progressFill {
  from {
    width: 0;
  }

  to {
    width: var(--value);
  }
}

.relative .bg-green-500,
.relative .bg-yellow-500,
.relative .bg-red-500 {
  animation: progressFill 1s ease-out forwards;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
