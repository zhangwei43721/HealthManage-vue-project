<template>
  <div class="health-dashboard min-h-screen pb-20 pt-24 dark:bg-gray-900 dark:text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">健康数据中心</h1>
        <p class="mt-3 text-xl text-gray-500 dark:text-gray-400">全面了解您的健康状况和历史变化</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 健康指数卡片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden" style="height: 300px">
          <div class="p-6 flex flex-col items-center justify-center h-full relative">
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" stroke-width="10" />
              <circle cx="50" cy="50" r="40" fill="none" :stroke="healthIndexColor" stroke-width="10"
                stroke-dasharray="251.2" :stroke-dashoffset="251.2 * (1 - healthIndex / 100)"
                transform="rotate(-90 50 50)" />
            </svg>
            <div class="relative z-10 flex flex-col items-center">
              <span class="text-5xl font-bold" :style="`color: ${healthIndexColor}`">{{ healthIndex }}%</span>
              <span class="text-gray-600 dark:text-gray-300 mt-2 text-lg font-medium">健康指数</span>
            </div>
          </div>
        </div>

        <!-- 身体数据区块 -->
        <div class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">身体数据</h2>
            <div class="grid grid-cols-3 gap-6">
              <div>
                <div class="h-48 flex flex-col items-center justify-center">
                  <div class="text-center">
                    <div class="text-xl text-gray-700 dark:text-gray-300">身高</div>
                    <div class="flex items-baseline mt-2">
                      <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ bodyData.height }}</span>
                      <span class="ml-1 text-gray-500 dark:text-gray-400 text-sm">cm</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="h-48 flex flex-col items-center justify-center">
                  <div class="text-center">
                    <div class="text-xl text-gray-700 dark:text-gray-300">体重</div>
                    <div class="flex items-baseline mt-2">
                      <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ bodyData.weight }}</span>
                      <span class="ml-1 text-gray-500 dark:text-gray-400 text-sm">kg</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="h-48 flex flex-col items-center justify-center">
                  <div class="text-center">
                    <div class="text-xl text-gray-700 dark:text-gray-300">BMI</div>
                    <div class="flex items-baseline mt-2">
                      <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ bmi.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 生命体征数据 -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">生命体征</h2>
          <div class="space-y-6">
            <!-- 血糖 -->
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">血糖</span>
                <span class="text-sm font-medium" :class="getValueStatusClass(bodyData.bloodSugar, 4, 6, 3, 7)">
                  {{ bodyData.bloodSugar }} mmol/L <span v-if="isNormal(bodyData.bloodSugar, 4, 6)">(正常)</span>
                  <span v-else>(偏高)</span>
                </span>
              </div>
              <div class="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="absolute top-0 left-0 h-full" :class="getProgressBarClass(bodyData.bloodSugar, 4, 6, 3, 7)"
                  :style="`width: ${Math.min(bodyData.bloodSugar / 10 * 100, 100)}%`"></div>
              </div>
            </div>

            <!-- 血脂 -->
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">血脂</span>
                <span class="text-sm font-medium"
                  :class="getValueStatusClass(parseFloat(bodyData.bloodLipid), 2.8, 5.2, 2, 6)">
                  {{ bodyData.bloodLipid }} mmol/L <span
                    v-if="isNormal(parseFloat(bodyData.bloodLipid), 2.8, 5.2)">(正常)</span>
                  <span v-else>(偏高)</span>
                </span>
              </div>
              <div class="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="absolute top-0 left-0 h-full"
                  :class="getProgressBarClass(parseFloat(bodyData.bloodLipid), 2.8, 5.2, 2, 6)"
                  :style="`width: ${Math.min(parseFloat(bodyData.bloodLipid) / 10 * 100, 100)}%`"></div>
              </div>
            </div>

            <!-- 血压 -->
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">血压</span>
                <span class="text-sm font-medium"
                  :class="getValueStatusClass(parseInt(bodyData.bloodPressure), 90, 120, 80, 140)">
                  {{ bodyData.bloodPressure }} mmHg <span
                    v-if="isNormal(parseInt(bodyData.bloodPressure), 90, 120)">(正常)</span>
                  <span v-else>(偏低)</span>
                </span>
              </div>
              <div class="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="absolute top-0 left-0 h-full"
                  :class="getProgressBarClass(parseInt(bodyData.bloodPressure), 90, 120, 80, 140)"
                  :style="`width: ${Math.min(parseInt(bodyData.bloodPressure) / 200 * 100, 100)}%`"></div>
              </div>
            </div>

            <!-- 心率 -->
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">心率</span>
                <span class="text-sm font-medium" :class="getValueStatusClass(bodyData.heartRate, 60, 100, 40, 120)">
                  {{ bodyData.heartRate }} bpm <span v-if="isNormal(bodyData.heartRate, 60, 100)">(正常)</span>
                  <span v-else>(偏低)</span>
                </span>
              </div>
              <div class="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div class="absolute top-0 left-0 h-full"
                  :class="getProgressBarClass(bodyData.heartRate, 60, 100, 40, 120)"
                  :style="`width: ${Math.min(bodyData.heartRate / 150 * 100, 100)}%`"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 健康评估图表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <!-- 健康评估分数 (使用 ECharts) -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">健康评估分数</h2>
            <div ref="scoreChartContainer" class="h-72 w-full"></div> <!-- ECharts 容器 -->
          </div>
        </div>

        <!-- 健康趋势图 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">健康趋势综合图</h2>
            <div ref="chartContainer" class="h-80 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getUserInfo, getHistoricalData } from '../services/health';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponent,
  AxisPointerComponent,
  VisualMapComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import type { EChartsOption } from 'echarts';

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponent,
  AxisPointerComponent,
  VisualMapComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
  UniversalTransition
]);

// 定义历史数据接口
interface HistoricalRecord {
  id: number;
  notesid: number;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bloodSugar: number;
  bloodPressure: string;
  bloodLipid: string;
  heartRate: number;
  vision: number;
  sleepDuration: number;
  sleepQuality: string;
  smoking: boolean;
  drinking: boolean;
  exercise: boolean;
  foodTypes: string;
  waterConsumption: number;
  date: number;
}

// 新增：定义 BodyData 类型
interface BodyDataType {
  id: number;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bloodSugar: number;
  bloodPressure: string;
  bloodLipid: string;
  heartRate: number;
  vision: number;
  sleepDuration: number;
  sleepQuality: string;
  smoking: boolean;
  drinking: boolean;
  exercise: boolean;
  foodTypes: string;
  waterConsumption: number;
}

// 初始化数据
const bodyData = ref<BodyDataType>({
  id: 1,
  name: '加载中...',
  age: 0,
  gender: '男',
  height: 0,
  weight: 0,
  bloodSugar: 0,
  bloodPressure: '0',
  bloodLipid: '0',
  heartRate: 0,
  vision: 0,
  sleepDuration: 0,
  sleepQuality: '',
  smoking: false,
  drinking: false,
  exercise: false,
  foodTypes: '',
  waterConsumption: 0
});

const historyData = ref<HistoricalRecord[]>([]);
const chartContainer = ref<HTMLElement | null>(null);
const scoreChartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let scoreChartInstance: echarts.ECharts | null = null;
let resizeObserver: any | null = null;
let scoreResizeObserver: any | null = null;
let themeObserver: MutationObserver | null = null;

// 计算BMI
const bmi = computed(() => {
  if (!bodyData.value.height || !bodyData.value.weight) return 0;
  const heightInMeters = bodyData.value.height / 100;
  return bodyData.value.weight / (heightInMeters * heightInMeters);
});

// 健康指数计算 (简单算法示例，基于各项指标)
const healthIndex = computed(() => {
  // 检查数据是否已加载
  if (!bodyData.value.id) return 0;

  let total = 0;

  // BMI评分 (18.5-24.9 为健康范围)
  const bmiScore = bmi.value >= 18.5 && bmi.value <= 24.9
    ? 100
    : (bmi.value < 18.5
      ? 100 - (18.5 - bmi.value) * 10
      : 100 - (bmi.value - 24.9) * 5);

  // 血糖评分 (4-6 mmol/L 为正常范围)
  const bloodSugarScore = bodyData.value.bloodSugar >= 4 && bodyData.value.bloodSugar <= 6
    ? 100
    : (bodyData.value.bloodSugar < 4
      ? 100 - (4 - bodyData.value.bloodSugar) * 20
      : 100 - (bodyData.value.bloodSugar - 6) * 15);

  // 血压评分 (90-120 为正常范围)
  const bloodPressureValue = parseInt(bodyData.value.bloodPressure);
  const bloodPressureScore = bloodPressureValue >= 90 && bloodPressureValue <= 120
    ? 100
    : (bloodPressureValue < 90
      ? 100 - (90 - bloodPressureValue) * 2
      : 100 - (bloodPressureValue - 120) * 1.5);

  // 心率评分 (60-100 为正常范围)
  const heartRateScore = bodyData.value.heartRate >= 60 && bodyData.value.heartRate <= 100
    ? 100
    : (bodyData.value.heartRate < 60
      ? 100 - (60 - bodyData.value.heartRate) * 2
      : 100 - (bodyData.value.heartRate - 100) * 1.5);

  // 生活习惯评分
  const lifestyleScore = 100 -
    (bodyData.value.smoking ? 20 : 0) -
    (bodyData.value.drinking ? 10 : 0) +
    (bodyData.value.exercise ? 10 : 0);

  // 计算总分 (加权平均)
  total = (bmiScore * 2 + bloodSugarScore * 2 + bloodPressureScore * 2 + heartRateScore * 2 + lifestyleScore * 2) / 10;

  return Math.round(Math.max(0, Math.min(100, total)));
});

// 健康指数颜色
const healthIndexColor = computed(() => {
  if (healthIndex.value >= 80) return '#10b981'; // 绿色 - 健康
  if (healthIndex.value >= 60) return '#f59e0b'; // 黄色 - 一般
  return '#ef4444'; // 红色 - 不佳
});

// 健康评估分数数据
const healthScores = computed(() => {
  const scores = calculateDetailedScores();
  const clamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));
  return [
    { name: 'BMI', score: clamp(scores.bmiScore) },
    { name: '血糖', score: clamp(scores.bloodSugarScore) },
    { name: '血压', score: clamp(scores.bloodPressureScore) },
    { name: '心率', score: clamp(scores.heartRateScore) },
    { name: '能力', score: clamp(scores.lifestyleScore) }
  ];
});

// 辅助函数：计算详细分数
function calculateDetailedScores() {
  const bmiValue = bmi.value;
  const bmiScore = bmiValue >= 18.5 && bmiValue <= 24.9
    ? 100
    : (bmiValue < 18.5
      ? Math.max(0, 100 - (18.5 - bmiValue) * 10)
      : Math.max(0, 100 - (bmiValue - 24.9) * 5));
  const bloodSugarValue = bodyData.value.bloodSugar;
  const bloodSugarScore = bloodSugarValue >= 4 && bloodSugarValue <= 6
    ? 100
    : (bloodSugarValue < 4
      ? Math.max(0, 100 - (4 - bloodSugarValue) * 20)
      : Math.max(0, 100 - (bloodSugarValue - 6) * 15));
  const bloodPressureValue = parseInt(bodyData.value.bloodPressure);
  const bloodPressureScore = bloodPressureValue >= 90 && bloodPressureValue <= 120
    ? 100
    : (bloodPressureValue < 90
      ? Math.max(0, 100 - (90 - bloodPressureValue) * 2)
      : Math.max(0, 100 - (bloodPressureValue - 120) * 1.5));
  const heartRateValue = bodyData.value.heartRate;
  const heartRateScore = heartRateValue >= 60 && heartRateValue <= 100
    ? 100
    : (heartRateValue < 60
      ? Math.max(0, 100 - (60 - heartRateValue) * 2)
      : Math.max(0, 100 - (heartRateValue - 100) * 1.5));
  const lifestyleScore = 100 -
    (bodyData.value.smoking ? 20 : 0) -
    (bodyData.value.drinking ? 10 : 0) +
    (bodyData.value.exercise ? 10 : 0);
  return { bmiScore, bloodSugarScore, bloodPressureScore, heartRateScore, lifestyleScore };
}

// 判断是否在正常范围内
function isNormal(value: number, min: number, max: number) {
  return value >= min && value <= max;
}

// 获取值的颜色状态
function getValueStatusClass(value: number, normalMin: number, normalMax: number, warningMin: number, warningMax: number) {
  if (isNormal(value, normalMin, normalMax)) return 'text-green-600 dark:text-green-400';
  if (value < warningMin || value > warningMax) return 'text-red-600 dark:text-red-400';
  return 'text-yellow-600 dark:text-yellow-400';
}

// 获取进度条颜色
function getProgressBarClass(value: number, normalMin: number, normalMax: number, warningMin: number, warningMax: number) {
  if (isNormal(value, normalMin, normalMax)) return 'bg-green-500';
  if (value < warningMin || value > warningMax) return 'bg-red-500';
  return 'bg-yellow-500';
}

// 获取分数对应的 Hex 颜色
function getScoreHexColor(score: number): string {
  if (score >= 80) return '#10b981'; // 绿色 (对应 Tailwind green-500)
  if (score >= 60) return '#f59e0b'; // 黄色 (对应 Tailwind yellow-500)
  return '#ef4444'; // 红色 (对应 Tailwind red-500)
}

// 格式化日期
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 更新 ECharts 配置
const updateChartOptions = () => {
  if (!chartInstance || historyData.value.length === 0) {
    return;
  }

  // 确保数据按日期升序排序
  const sortedData = [...historyData.value].sort((a, b) => a.date - b.date);

  const dates = sortedData.map(item => formatDate(item.date));
  const bloodPressures = sortedData.map(item => parseFloat(item.bloodPressure || '0'));
  const bloodSugars = sortedData.map(item => parseFloat(String(item.bloodSugar || '0')));
  const heartRates = sortedData.map(item => parseFloat(String(item.heartRate || '0')));
  const bloodLipids = sortedData.map(item => parseFloat(item.bloodLipid || '0'));

  const isDarkMode = document.documentElement.classList.contains('dark');

  const option: EChartsOption = {
    darkMode: isDarkMode,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['血压', '血糖', '心率', '血脂'],
      textStyle: {
        color: isDarkMode ? '#ccc' : '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: isDarkMode ? '#555' : '#ccc' } },
      axisLabel: { color: isDarkMode ? '#ccc' : '#333' }
    },
    yAxis: [
      {
        type: 'value',
        name: '血压(mmHg)',
        position: 'left',
        alignTicks: true,
        axisLine: { show: true, lineStyle: { color: '#3b82f6' } },
        axisLabel: { formatter: '{value}', color: isDarkMode ? '#ccc' : '#333' }
      },
      {
        type: 'value',
        name: '血糖(mmol/L)',
        position: 'right',
        alignTicks: true,
        axisLine: { show: true, lineStyle: { color: '#f59e0b' } },
        axisLabel: { formatter: '{value}', color: isDarkMode ? '#ccc' : '#333' }
      },
      {
        type: 'value',
        name: '心率(bpm)',
        position: 'left',
        offset: 60,
        alignTicks: true,
        axisLine: { show: true, lineStyle: { color: '#10b981' } },
        axisLabel: { formatter: '{value}', color: isDarkMode ? '#ccc' : '#333' }
      },
      {
        type: 'value',
        name: '血脂(mmol/L)',
        position: 'right',
        offset: 60,
        alignTicks: true,
        axisLine: { show: true, lineStyle: { color: '#ec4899' } },
        axisLabel: { formatter: '{value}', color: isDarkMode ? '#ccc' : '#333' }
      }
    ],
    series: [
      {
        name: '血压',
        type: 'line',
        yAxisIndex: 0,
        data: bloodPressures,
        smooth: true,
        itemStyle: { color: '#3b82f6' },
        lineStyle: { color: '#3b82f6' }
      },
      {
        name: '血糖',
        type: 'line',
        yAxisIndex: 1,
        data: bloodSugars,
        smooth: true,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { color: '#f59e0b' }
      },
      {
        name: '心率',
        type: 'line',
        yAxisIndex: 2,
        data: heartRates,
        smooth: true,
        itemStyle: { color: '#10b981' },
        lineStyle: { color: '#10b981' }
      },
      {
        name: '血脂',
        type: 'line',
        yAxisIndex: 3,
        data: bloodLipids,
        smooth: true,
        itemStyle: { color: '#ec4899' },
        lineStyle: { color: '#ec4899' }
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        textStyle: {
          color: isDarkMode ? '#ccc' : '#333'
        }
      }
    ]
  };

  chartInstance.setOption(option);
};

// 初始化 ECharts 实例
const initChart = () => {
  if (chartContainer.value) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    chartInstance = echarts.init(chartContainer.value, isDarkMode ? 'dark' : undefined);
    updateChartOptions();

    resizeObserver = new ResizeObserver(() => {
      chartInstance?.resize();
    });
    resizeObserver.observe(chartContainer.value);
  }
};

// 监听深色模式变化 (使用 MutationObserver)
const observeThemeChange = () => {
  const targetNode = document.documentElement;
  const config = { attributes: true, attributeFilter: ['class'] };

  const callback = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'class') {
        if (chartInstance) {
          chartInstance.dispose();
          initChart();
        }
        if (scoreChartInstance) {
          scoreChartInstance.dispose();
          initScoreChart();
        }
      }
    }
  };

  themeObserver = new MutationObserver(callback);
  themeObserver.observe(targetNode, config);
};

// 获取用户健康数据
async function fetchUserHealthData() {
  try {
    const response = await getUserInfo();
    if (response.data && response.data.bodyList && response.data.bodyList.length > 0) {
      bodyData.value = response.data.bodyList[0];
    }
  } catch (error) {
    console.error('获取健康数据失败:', error);
  }
}

// 获取历史健康数据
async function fetchHistoryData() {
  try {
    if (!bodyData.value || bodyData.value.id === undefined) {
      console.warn('无法获取历史数据，用户 ID 未定义。');
      return;
    }
    const response = await getHistoricalData(bodyData.value.id);
    if (response.data && Array.isArray(response.data)) {
      historyData.value = response.data
        .filter((item: HistoricalRecord): item is HistoricalRecord => item && item.date != null)
        .sort((a: HistoricalRecord, b: HistoricalRecord) => a.date - b.date);
    } else {
      historyData.value = [];
      console.warn('获取的历史数据格式不正确或为空:', response.data);
    }
    await nextTick();
    updateChartOptions();
  } catch (error) {
    console.error('获取历史数据失败:', error);
    historyData.value = [];
  }
}

// 在页面加载时获取数据
onMounted(async () => {
  await fetchUserHealthData();
  await fetchHistoryData();
  await nextTick();
  initChart();
  initScoreChart();
  observeThemeChange();
});

onUnmounted(() => {
  chartInstance?.dispose();
  scoreChartInstance?.dispose();
  if (chartContainer.value && resizeObserver) {
    resizeObserver.unobserve(chartContainer.value);
  }
  if (scoreChartContainer.value && scoreResizeObserver) {
    scoreResizeObserver.unobserve(scoreChartContainer.value);
  }
  resizeObserver = null;
  scoreResizeObserver = null;
  themeObserver?.disconnect();
  themeObserver = null;
});

// 监听 historyData 变化以更新图表
watch(historyData, async (newData: HistoricalRecord[]) => {
  if (newData && newData.length > 0) {
    await nextTick();
    updateChartOptions();
  } else if (chartInstance) {
    chartInstance.setOption({
      series: []
    }, true);
  }
}, { deep: true });
// 监听 bodyData 变化以更新分数图
watch(bodyData, async (newData: BodyDataType) => {
  if (newData && newData.name !== '加载中...') {
    await nextTick();
    updateScoreChartOptions();
  }
}, { deep: true });

// 更新 ECharts 评估分数图配置
const updateScoreChartOptions = () => {
  if (!scoreChartInstance || healthScores.value.length === 0) {
    return;
  }
  const scoresData = healthScores.value;
  const categoryData = scoresData.map((item: { name: string; score: number }) => item.name);
  const seriesData = scoresData.map((item: { name: string; score: number }) => item.score);
  const isDarkMode = document.documentElement.classList.contains('dark');

  const option: EChartsOption = {
    darkMode: isDarkMode,
    title: {
      left: 'center',
      textStyle: {
        fontSize: 16,
        color: isDarkMode ? '#ccc' : '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}分',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categoryData,
      axisLabel: {
        interval: 0,
        color: isDarkMode ? '#ccc' : '#5e6d82'
      },
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#555' : '#eee'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '评分',
      min: 0,
      max: 100,
      interval: 20,
      nameTextStyle: {
        color: isDarkMode ? '#ccc' : '#5e6d82'
      },
      axisLabel: {
        color: isDarkMode ? '#ccc' : '#5e6d82'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: isDarkMode ? '#333' : '#eee'
        }
      }
    },
    series: [
      {
        name: '评分',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: (params: any) => {
            const score = params.value;
            return getScoreHexColor(score);
          },
          borderRadius: [5, 5, 0, 0]
        },
        data: seriesData
      }
    ]
  };
  scoreChartInstance.setOption(option);
};

// 初始化 ECharts 评估分数图实例
const initScoreChart = () => {
  if (scoreChartContainer.value) {
    const isDarkMode = document.documentElement.classList.contains('dark');
    scoreChartInstance = echarts.init(scoreChartContainer.value, isDarkMode ? 'dark' : undefined);
    updateScoreChartOptions();

    scoreResizeObserver = new ResizeObserver(() => {
      scoreChartInstance?.resize();
    });
    scoreResizeObserver.observe(scoreChartContainer.value);
  }
};
</script>

<style scoped>
.health-dashboard {
  background-color: #f9fafb;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.dark .health-dashboard {
  background-color: #111827;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* 动画效果 */
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
</style>
