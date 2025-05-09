<template>
  <div class="health-dashboard min-h-screen pb-12 pt-24 dark:bg-gray-900 dark:text-white">
    <!-- 加载状态显示 -->
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

    <!-- 错误信息显示 -->
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

    <!-- 主内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 页面标题 -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">个人健康数据中心</h1>
        <p class="mt-2 text-base text-gray-500 dark:text-gray-400">全面了解您的健康状况和趋势变化</p>
      </div>

      <!-- 用户信息录入弹窗 -->
      <Transition name="fade">
        <div v-if="showUserInfoDialog"
          class="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-3xl bg-white rounded-lg overflow-hidden shadow-2xl" @click.stop>
            <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 p-4">
              <h2 class="text-lg font-semibold text-gray-800">录入个人健康信息</h2>
              <Button type="text" :icon="Close" @click="closeUserInfoDialog" aria-label="关闭"
                class="text-gray-500 hover:text-gray-700"></Button>
            </div>

            <form @submit.prevent="submitUserInfoForm" class="space-y-6 max-h-[70vh] overflow-y-auto p-4">
              <!-- 表单内容 -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- 基本信息 -->
                <div class="lg:col-span-3 p-3 bg-blue-50 rounded-lg mb-2">
                  <h3 class="text-sm font-medium text-blue-800 mb-3">基本信息</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField v-model="userInfoForm.name" label="姓名" placeholder="请输入姓名" :error="!!formErrors.name"
                      :errorMessage="formErrors.name" required />
                    <InputField v-model.number="userInfoForm.age" type="number" label="年龄" placeholder="请输入年龄"
                      :error="!!formErrors.age" :errorMessage="formErrors.age" required />
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">性别 <span
                          class="text-red-500">*</span></label>
                      <select v-model="userInfoForm.gender" required
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md shadow-sm">
                        <option value="男">男</option>
                        <option value="女">女</option>
                        <option value="其他">其他</option>
                      </select>
                      <p v-if="formErrors.gender" class="mt-1 text-xs text-red-600">{{ formErrors.gender }}</p>
                    </div>
                  </div>
                </div>

                <!-- 身体指标 - 添加文字描述 -->
                <div class="lg:col-span-3 p-3 bg-green-50 rounded-lg mb-2">
                  <h3 class="text-sm font-medium text-green-800 mb-3">身体指标</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <InputField v-model.number="userInfoForm.height" type="number" step="0.1" label="身高 (cm)"
                        placeholder="请输入身高" :error="!!formErrors.height" :errorMessage="formErrors.height" required />
                      <p class="text-xs text-gray-500 mt-1">正常成人身高范围：150-200cm</p>
                    </div>
                    <div>
                      <InputField v-model.number="userInfoForm.weight" type="number" step="0.1" label="体重 (kg)"
                        placeholder="请输入体重" :error="!!formErrors.weight" :errorMessage="formErrors.weight" required />
                      <p class="text-xs text-gray-500 mt-1">体重标准：BMI指数18.5-24.9</p>
                    </div>
                    <div>
                      <InputField v-model.number="userInfoForm.heartRate" type="number" label="心率 (次/分)"
                        placeholder="例如: 75" />
                      <p class="text-xs text-gray-500 mt-1">正常心率范围：60-100次/分</p>
                    </div>
                    <div>
                      <InputField v-model="userInfoForm.bloodPressure" label="血压" placeholder="例如: 120/80 mmHg" />
                      <p class="text-xs text-gray-500 mt-1">正常血压：120/80 mmHg</p>
                    </div>
                    <div>
                      <InputField v-model="userInfoForm.bloodSugar" label="血糖" placeholder="例如: 5.5 mmol/L" />
                      <p class="text-xs text-gray-500 mt-1">空腹血糖：3.9-6.1 mmol/L</p>
                    </div>
                    <div>
                      <InputField v-model="userInfoForm.bloodLipid" label="血脂" placeholder="例如: 正常/偏高" />
                      <p class="text-xs text-gray-500 mt-1">总胆固醇应低于5.2 mmol/L</p>
                    </div>
                  </div>
                </div>

                <!-- 生活习惯 -->
                <div class="lg:col-span-3 p-3 bg-yellow-50 rounded-lg">
                  <h3 class="text-sm font-medium text-yellow-800 mb-3">生活习惯</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <InputField v-model.number="userInfoForm.sleepDuration" type="number" step="0.5" label="睡眠时长 (h)"
                        placeholder="例如: 8" />
                      <p class="text-xs text-gray-500 mt-1">成人推荐睡眠：7-9小时/天</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">睡眠质量</label>
                      <div class="flex space-x-4 mt-2">
                        <label v-for="q in sleepQualityOptions" :key="q.value"
                          class="inline-flex items-center cursor-pointer">
                          <input type="radio" class="form-radio text-primary focus:ring-primary border-gray-300 rounded"
                            v-model.number="userInfoForm.sleepQuality" :value="q.value">
                          <span class="ml-2 text-sm text-gray-700">{{ q.label }}</span>
                        </label>
                      </div>
                      <p v-if="formErrors.sleepQuality" class="mt-1 text-xs text-red-600">{{ formErrors.sleepQuality }}</p>
                    </div>
                    <div>
                      <InputField v-model.number="userInfoForm.waterConsumption" type="number" label="饮水量 (ml)"
                        placeholder="例如: 1500" />
                      <p class="text-xs text-gray-500 mt-1">建议：1500-2000ml/天</p>
                    </div>

                    <div class="flex items-center space-x-4">
                      <label class="text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center">
                        <input type="checkbox" v-model="userInfoForm.smoking"
                          class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary">
                        <span class="ml-2">吸烟</span>
                      </label>
                    </div>
                    <div class="flex items-center space-x-4">
                      <label class="text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center">
                        <input type="checkbox" v-model="userInfoForm.drinking"
                          class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary">
                        <span class="ml-2">饮酒</span>
                      </label>
                    </div>
                    <div class="flex items-center space-x-4">
                      <label class="text-sm font-medium text-gray-700 cursor-pointer select-none flex items-center">
                        <input type="checkbox" v-model="userInfoForm.exercise"
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
                          :class="userInfoForm.foodTypes && userInfoForm.foodTypes.includes(food.value) ? 'bg-primary-light text-primary border-primary' : 'border-gray-300 text-gray-700'">
                          <input type="checkbox" :value="food.value" v-model="userInfoForm.foodTypes" class="hidden">
                          {{ food.label }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 按钮 -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <Button type="outline" @click="closeUserInfoDialog">取消</Button>
                <Button type="primary" native-type="submit" :disabled="isFormSubmitting">
                  <LoadingOne v-if="isFormSubmitting" theme="outline" size="18" :spin="true" class="mr-2" />
                  {{ isFormSubmitting ? '提交中...' : '确定' }}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

      <!-- 添加悬浮按钮 -->
      <div class="fixed left-6 bottom-6 z-50">
        <div class="relative group">
          <Button
            type="primary"
            :icon="Edit"
            @click="showUserInfoDialog = true"
            class="rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="编辑健康信息">
          </Button>
          <div class="absolute left-full ml-2 px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            编辑健康信息
          </div>
        </div>
      </div>

      <!-- 健康指数和身体数据卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 健康指数卡片 -->
        <div class="lg:col-span-3">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-full transform hover:scale-102 transition-transform duration-300">
            <div class="p-6 flex flex-col items-center justify-center h-full relative">
              <svg class="mb-4 w-40 h-40" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" :stop-color="healthIndexColor" />
                    <stop offset="100%" :stop-color="healthGradientEndColor" />
                  </linearGradient>
                  <!-- 水球图波浪效果滤镜 -->
                  <filter id="wave" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="1" result="noise"
                      seed="10" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R"
                      yChannelSelector="G" />
                  </filter>
                  <clipPath id="clip">
                    <circle cx="50" cy="50" r="45" />
                  </clipPath>
                  <!-- 水波纹动画 -->
                  <linearGradient id="liquidFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="rgba(72, 202, 139, 0.8)" />
                    <stop offset="100%" stop-color="rgba(72, 202, 139, 0.2)" />
                  </linearGradient>
                  <!-- 波浪动画 -->
                  <animate xlink:href="#wave-path" attributeName="d" dur="5s" begin="0s" repeatCount="indefinite"
                    values="
                      M 0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z;
                      M 0 50 Q 25 60 50 50 T 100 50 V 100 H 0 Z;
                      M 0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z" />
                </defs>

                <!-- 外圆 -->
                <circle cx="50" cy="50" r="45" fill="none" stroke="#50C878" stroke-width="2" />

                <!-- 水球主体 -->
                <g clip-path="url(#clip)">
                  <!-- 填充背景 -->
                  <rect x="0" :y="100 - calculatedHealthScore" width="100" :height="calculatedHealthScore"
                    fill="url(#liquidFill)" />

                  <!-- 波浪效果 -->
                  <path id="wave-path"
                    :d="`M 0 ${110 - calculatedHealthScore} Q 25 ${100 - calculatedHealthScore} 50 ${110 - calculatedHealthScore} T 100 ${110 - calculatedHealthScore} V 100 H 0 Z`"
                    fill="url(#liquidFill)" filter="url(#wave)">
                  </path>

                  <!-- 第二层波浪（透明度较低，形成层次感） -->
                  <path
                    :d="`M 0 ${115 - calculatedHealthScore} Q 30 ${105 - calculatedHealthScore} 55 ${115 - calculatedHealthScore} T 100 ${115 - calculatedHealthScore} V 100 H 0 Z`"
                    fill="rgba(72, 202, 139, 0.3)" filter="url(#wave)" opacity="0.7">
                    <animate attributeName="d" dur="6s" begin="0.5s" repeatCount="indefinite"
                      values="
                        M 0 ${115 - calculatedHealthScore} Q 30 ${105 - calculatedHealthScore} 55 ${115 - calculatedHealthScore} T 100 ${115 - calculatedHealthScore} V 100 H 0 Z;
                        M 0 ${115 - calculatedHealthScore} Q 30 ${125 - calculatedHealthScore} 55 ${115 - calculatedHealthScore} T 100 ${115 - calculatedHealthScore} V 100 H 0 Z;
                        M 0 ${115 - calculatedHealthScore} Q 30 ${105 - calculatedHealthScore} 55 ${115 - calculatedHealthScore} T 100 ${115 - calculatedHealthScore} V 100 H 0 Z" />
                  </path>
                </g>

                <!-- 显示百分比的文字 -->
                <text x="50" y="55" text-anchor="middle" font-size="20" font-weight="bold" fill="#fff">{{
                  calculatedHealthScore }}%</text>
              </svg>
              <div class="text-center">
                <div class="text-gray-600 dark:text-gray-300 mt-2 text-lg font-medium">健康指数</div>
                <div class="mt-3 text-lg font-medium" :class="getHealthIndexClass(calculatedHealthScore)">{{
                  getHealthIndexText(calculatedHealthScore) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 身体数据和生命体征卡片 -->
        <div class="lg:col-span-9">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <!-- 身体基础数据 -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div class="p-5">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z">
                    </path>
                  </svg>
                  身体基础数据
                </h2>
                <!-- 将身高、体重、BMI改为紧凑的行式布局 -->
                <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                  <div class="flex flex-row items-center justify-between">
                    <div class="flex items-center">
                      <div class="text-sm text-gray-600 dark:text-gray-300">身高：</div>
                      <div class="ml-2 font-bold text-gray-900 dark:text-white">{{ bodyData.height }} <span
                          class="text-xs font-normal text-gray-500 dark:text-gray-400">cm</span></div>
                    </div>
                    <div class="flex items-center">
                      <div class="text-sm text-gray-600 dark:text-gray-300">体重：</div>
                      <div class="ml-2 font-bold text-gray-900 dark:text-white">{{ bodyData.weight }} <span
                          class="text-xs font-normal text-gray-500 dark:text-gray-400">kg</span></div>
                    </div>
                    <div class="flex items-center">
                      <div class="text-sm text-gray-600 dark:text-gray-300">BMI：</div>
                      <div class="ml-2 font-bold text-gray-900 dark:text-white">{{ bmi.toFixed(1) }}</div>
                      <div class="ml-1 text-xs" :class="getBmiCommentClass(bmi)">{{ getBmiComment(bmi) }}</div>
                    </div>
                  </div>
                </div>
                <div class="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">其他指标</div>
                <div class="grid grid-cols-2 gap-4">
                  <!-- 其他身体数据项 -->
                  <div v-if="bodyData.age"
                    class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div class="flex flex-col items-center justify-center">
                      <div class="text-center">
                        <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">年龄</div>
                        <div class="flex items-baseline justify-center">
                          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ bodyData.age }}</span>
                          <span class="ml-1 text-gray-500 dark:text-gray-400 text-xs">岁</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="bodyData.gender"
                    class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div class="flex flex-col items-center justify-center">
                      <div class="text-center">
                        <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">性别</div>
                        <div class="flex items-baseline justify-center">
                          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ bodyData.gender }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="bodyData.sleepDuration"
                    class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div class="flex flex-col items-center justify-center">
                      <div class="text-center">
                        <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">睡眠时长</div>
                        <div class="flex items-baseline justify-center">
                          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ bodyData.sleepDuration
                            }}</span>
                          <span class="ml-1 text-gray-500 dark:text-gray-400 text-xs">小时</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="bodyData.waterConsumption"
                    class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div class="flex flex-col items-center justify-center">
                      <div class="text-center">
                        <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">饮水量</div>
                        <div class="flex items-baseline justify-center">
                          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ bodyData.waterConsumption
                            }}</span>
                          <span class="ml-1 text-gray-500 dark:text-gray-400 text-xs">ml</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 生命体征指标 -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div class="p-5">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  生命体征指标
                </h2>
                <div class="space-y-4">
                  <div v-for="vital in vitalSignsConfig" :key="vital.key"
                    class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-md dark:hover:bg-gray-600">
                    <div class="flex flex-col mb-2">
                      <div class="flex items-center justify-between">
                        <span class="text-md font-medium text-gray-700 dark:text-gray-200">{{ vital.label }}</span>
                        <span class="text-md font-medium" :class="getVitalStatus(vital.value, vital.ranges).textClass">
                          {{ vital.value }} {{ vital.unit }}
                          <span v-if="getVitalStatus(vital.value, vital.ranges).status === 'normal'"
                            class="inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">(正常)</span>
                          <span v-else-if="getVitalStatus(vital.value, vital.ranges).status === 'high'"
                            class="inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">(偏高)</span>
                          <span v-else-if="getVitalStatus(vital.value, vital.ranges).status === 'low'"
                            class="inline-flex items-center ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">(偏低)</span>
                        </span>
                      </div>
                    </div>
                    <div class="relative h-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div class="absolute top-0 left-0 h-full rounded-full shadow-inner shadow-lg"
                        :class="getVitalStatus(vital.value, vital.ranges).progressClass"
                        :style="`width: ${calculateProgress(vital.value, vital.progressMax)}%; transition: width 1s ease-in-out;`">
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ vital.ranges.dangerLow }}</span>
                      <span class="text-green-500 font-medium">{{ vital.ranges.normalMin }} - {{ vital.ranges.normalMax
                        }}</span>
                      <span>{{ vital.ranges.dangerHigh }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 健康趋势综合图 -->
      <div class="mt-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <path d="M21 12h-4l-3 8-4-16-3 8H3"></path>
              </svg>
              健康趋势综合图
            </h2>
            <div ref="chartContainer" class="h-96 w-full"></div>
          </div>
        </div>
      </div>

      <!-- 两列卡片布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- 健康建议卡片 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              健康建议
            </h2>
            <div class="grid grid-cols-1 gap-4">
              <div v-for="(recommendation, index) in healthRecommendations" :key="index"
                class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center"
                      :class="recommendation.bgClass">
                      <svg class="w-5 h-5" :class="recommendation.iconClass" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path :d="recommendation.iconPath"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-md font-medium text-gray-900 dark:text-white">{{ recommendation.title }}</h3>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ recommendation.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center">
              <svg class="w-5 h-5 mr-2 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              以上健康建议仅供参考，如有不适请及时就医咨询专业医生。
            </div>
          </div>
        </div>

        <!-- BMI分析卡片 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z">
                </path>
              </svg>
              身体质量指数 (BMI)
            </h2>
            <div class="flex flex-col md:flex-row md:items-center p-2">
              <div class="md:w-1/4 text-center mb-5 md:mb-0">
                <div class="text-5xl font-bold mb-2" :class="getBmiColorClass(bmi)">{{ bmi.toFixed(1) }}</div>
                <div class="text-md font-medium" :class="getBmiColorClass(bmi)">{{ bodyType }}</div>
              </div>
              <div class="md:w-3/4 md:px-6">
                <div class="relative h-5 w-full bg-gray-200 dark:bg-gray-600 rounded-full mb-4">
                  <div
                    class="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"
                    style="width: 100%;"></div>
                  <div class="absolute top-0 h-full w-1 bg-white dark:bg-gray-800"
                    :style="`left: ${calculateBmiPosition(bmi)}%; transform: translateX(-50%);`"></div>
                  <div class="absolute -top-2 h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                    :class="getBmiBackgroundClass(bmi)"
                    :style="`left: ${calculateBmiPosition(bmi)}%; transform: translateX(-50%);`"></div>
                </div>
                <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>偏瘦</span>
                  <span>正常</span>
                  <span>超重</span>
                  <span>肥胖</span>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-xs text-gray-500">18.5</span>
                  <span class="text-xs text-gray-500">24</span>
                  <span class="text-xs text-gray-500">28</span>
                  <span class="text-xs text-gray-500">35+</span>
                </div>
                <div
                  class="mt-4 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p class="mb-3"><span class="font-medium">健康风险: </span>{{ obesityHealthRisk }}</p>
                  <p><span class="font-medium">体型建议: </span>{{ bodyTypeSuggestion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 健康风险分析卡片 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
              </svg>
              健康风险分析
            </h2>

            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="mb-4">
                <h3 class="text-md font-medium text-gray-900 dark:text-white mb-2">可能的健康风险：</h3>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ calculatedRisk }}</p>
              </div>

              <div class="grid grid-cols-1 gap-5 mt-4">
                <div
                  class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transform hover:scale-[1.02] transition-all duration-300">
                  <div class="flex items-center mb-3">
                    <svg class="w-5 h-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z">
                      </path>
                    </svg>
                    <h4 class="text-md font-medium text-gray-900 dark:text-white">生活习惯分析</h4>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ calculatedHabits }}</p>
                </div>

                <div
                  class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transform hover:scale-[1.02] transition-all duration-300">
                  <div class="flex items-center mb-3">
                    <svg class="w-5 h-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" stroke-width="2">
                      <path
                        d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 1.6 1.5v6.5h2v-9l-5.7-3.1zM17.7 10.3c-.6-.3-1.2.1-1.4.7L15 16.4l-1.2-2.1c-.3-.5-.9-.6-1.4-.3l-1 .6c-1.7 1-3.4 1.5-5.4 1.5v2c2.3 0 4.4-.6 6.3-1.7l.6 1c.3.5.9.6 1.4.3l1-.6c.5-.3.6-.9.3-1.4l-1.2-2.1L17 11l2.4 5.9h2L18 9l-.3-1.2z">
                      </path>
                    </svg>
                    <h4 class="text-md font-medium text-gray-900 dark:text-white">基础代谢率 (BMR)</h4>
                  </div>
                  <div class="flex items-center mb-2">
                    <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ calculatedBMR }}</div>
                    <div class="ml-2 text-sm text-gray-500 dark:text-gray-400">千卡/天</div>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    基础代谢率是指人体在清醒而完全静息状态下，维持生命所需的最低能量消耗。
                  </p>
                </div>
              </div>

              <div
                class="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-3 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-2 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                以上分析仅供参考，不能替代专业医疗诊断。如有不适，请及时就医。
              </div>
            </div>
          </div>
        </div>

        <!-- 视力分析卡片 -->
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z">
                </path>
              </svg>
              视力分析
            </h2>

            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-5">
              <div class="flex flex-col md:flex-row">
                <div
                  class="mb-5 md:mb-0 md:w-1/3 md:pr-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-600 pb-5 md:pb-0">
                  <div class="text-center mb-4">
                    <div class="text-md text-gray-700 dark:text-gray-300 mb-2">当前视力状况</div>
                    <div class="text-4xl font-bold text-gray-900 dark:text-white">{{ bodyData.vision || '无数据' }} <span
                        class="text-md font-normal text-gray-500 dark:text-gray-400">度</span></div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-lg py-2 px-5 shadow-sm">
                    <div class="text-md font-medium" :class="getVisionTypeColor(visionType)">{{ visionType }}</div>
                  </div>
                </div>

                <div class="md:w-2/3 md:pl-6">
                  <div class="w-full mb-5">
                    <div class="relative h-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
                      <div
                        class="absolute -top-2 h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                        :class="getVisionMarkerClass(bodyData.vision)"
                        :style="`left: ${calculateVisionPosition(bodyData.vision)}%; transform: translateX(-50%);`">
                      </div>
                    </div>
                    <div class="flex justify-between mt-3 text-sm text-gray-600 dark:text-gray-300">
                      <span>正常 (0度)</span>
                      <span>轻度近视 (≤300度)</span>
                      <span>中度近视 (≤600度)</span>
                      <span>高度近视 (>600度)</span>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <div class="flex items-center mb-3">
                      <svg class="w-5 h-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      <h3 class="text-md font-medium text-gray-900 dark:text-white">视力健康建议</h3>
                    </div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ visionSuggestion }}</p>
                  </div>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from '@/composables/vue-imports'
import { getUserBodyInfo as getUserInfo, getHistoricalData, addBodyInformationNotes } from '@/services/health.ts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent,
  MarkLineComponent, MarkPointComponent, ToolboxComponent, AxisPointerComponent, VisualMapComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';
import type { EChartsOption } from 'echarts';
import Button from '@/components/base/Button.vue';
import InputField from '@/components/base/InputField.vue';
import { Close, LoadingOne, Edit } from '@icon-park/vue-next';

echarts.use([
  TitleComponent, TooltipComponent, GridComponent, LegendComponent, DataZoomComponent, MarkLineComponent,
  MarkPointComponent, ToolboxComponent, AxisPointerComponent, VisualMapComponent, LineChart,
  CanvasRenderer, UniversalTransition
]);

interface HistoricalRecord {
  id: number; notesid: number; name: string; age: number; gender: string; height: number; weight: number;
  bloodSugar: number; bloodPressure: string; bloodLipid: string; heartRate: number; vision: number;
  sleepDuration: number; sleepQuality: string; smoking: boolean; drinking: boolean; exercise: boolean;
  foodTypes: string; waterConsumption: number; date: number;
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
let chartInstance: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;

const isLoading = ref(true);
const error = ref('');

const bmi = computed(() => {
  if (!bodyData.value.height || !bodyData.value.weight) return 0;
  const heightInMeters = bodyData.value.height / 100;
  return bodyData.value.weight / (heightInMeters * heightInMeters);
});



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

const getVitalStatus = (value: number, ranges: VitalRanges): VitalStatus => {
  if (value >= ranges.normalMin && value <= ranges.normalMax) {
    return { status: 'normal', textClass: 'text-green-600 dark:text-green-400', progressClass: 'bg-gradient-to-r from-green-400 to-green-600' };
  } else if (value < ranges.dangerLow || value > ranges.dangerHigh) {
    const status = value < ranges.dangerLow ? 'low' : 'high';
    return { status: status, textClass: 'text-red-600 dark:text-red-400', progressClass: 'bg-gradient-to-r from-red-400 to-red-600' };
  } else {
    const status = value < ranges.normalMin ? 'low' : 'high';
    return { status: status, textClass: 'text-yellow-600 dark:text-yellow-400', progressClass: 'bg-gradient-to-r from-yellow-400 to-yellow-600' };
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

const calculateProgress = (value: number, max: number): number => {
  return Math.min((value / max) * 100, 100);
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

const observeThemeChange = () => {
  const targetNode = document.documentElement;
  const config = { attributes: true, attributeFilter: ['class'] };
  const callback = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'class') {
        chartInstance?.dispose();
        initChart();
      }
    }
  };
  themeObserver = new MutationObserver(callback);
  themeObserver.observe(targetNode, config);
};

async function fetchUserHealthData() {
  error.value = '';
  try {
    const bodyInfoPayload = await getUserInfo();
    console.log("[health-data] fetchUserHealthData - bodyInfoPayload:", JSON.parse(JSON.stringify(bodyInfoPayload)));

    if (bodyInfoPayload && bodyInfoPayload.bodyList && bodyInfoPayload.bodyList.length > 0) {
      bodyData.value = bodyInfoPayload.bodyList[0];
      console.log("[health-data] fetchUserHealthData - Populated bodyData from bodyList:", JSON.parse(JSON.stringify(bodyData.value)));
    } else if (bodyInfoPayload && typeof bodyInfoPayload === 'object' && 'id' in bodyInfoPayload && !('bodyList' in bodyInfoPayload)) {
      bodyData.value = bodyInfoPayload as BodyDataType;
      console.log("[health-data] fetchUserHealthData - Populated bodyData from direct object:", JSON.parse(JSON.stringify(bodyData.value)));
    } else {
      console.warn('[health-data] fetchUserHealthData - No valid user health data or bodyList is empty. Payload:', JSON.parse(JSON.stringify(bodyInfoPayload)));
      bodyData.value = { id: 0, name: 'N/A', age: 0, gender: '男', height: 0, weight: 0, bloodSugar: 0, bloodPressure: '0', bloodLipid: '0', heartRate: 0, vision: 0, sleepDuration: 0, sleepQuality: '', smoking: false, drinking: false, exercise: false, foodTypes: '', waterConsumption: 0 };
      error.value = '';
      showUserInfoDialog.value = true;
      console.log("[health-data] fetchUserHealthData - showUserInfoDialog set to true.");
      try {
        const cachedData = localStorage.getItem('healthDataCache');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (typeof parsedData.foodTypes === 'string') {
            parsedData.foodTypes = parsedData.foodTypes.split(',').filter(Boolean);
          }
          const baseInfo = {
            name: userInfoForm.value.name || parsedData.name,
            age: userInfoForm.value.age === null || userInfoForm.value.age === undefined ? parsedData.age : userInfoForm.value.age,
            gender: userInfoForm.value.gender || parsedData.gender,
          };
          userInfoForm.value = { ...defaultLogForm, ...parsedData, ...baseInfo };
          console.log("[health-data] fetchUserHealthData - Loaded cached data into form.");
        }
      } catch (e) {
        console.error('[health-data] fetchUserHealthData - Failed to load or parse cached data:', e);
      }
    }
  } catch (err: unknown) {
    console.error('[health-data] fetchUserHealthData - Error caught:', err);
    if (err instanceof Error) {
      error.value = err.message;
    } else if (typeof err === 'string') {
      error.value = err;
    } else {
      error.value = '获取健康数据时发生未知错误，请稍后重试';
    }
    bodyData.value = { id: 0, name: '错误', age: 0, gender: 'N/A', height: 0, weight: 0, bloodSugar: 0, bloodPressure: '0', bloodLipid: '0', heartRate: 0, vision: 0, sleepDuration: 0, sleepQuality: '', smoking: false, drinking: false, exercise: false, foodTypes: '', waterConsumption: 0 };
  }
}

async function fetchHistoryData() {
  try {
    if (!bodyData.value?.id || bodyData.value.name === 'N/A' || bodyData.value.name === '错误') { // More robust check for valid bodyData
      console.warn('[health-data] fetchHistoryData - Skipping due to invalid bodyData.value.id or placeholder name.', JSON.parse(JSON.stringify(bodyData.value)));
      historyData.value = [];
      await nextTick(); // Ensure UI updates if historyData was cleared
      updateChartOptions(); // Update chart with empty data if necessary
      return;
    }
    const historyPayload = await getHistoricalData(bodyData.value.id);
    console.log("[health-data] fetchHistoryData - historyPayload:", JSON.parse(JSON.stringify(historyPayload)));
    if (historyPayload && Array.isArray(historyPayload)) {
      historyData.value = historyPayload
        .filter((item: HistoricalRecord): item is HistoricalRecord => item?.date != null)
        .sort((a: HistoricalRecord, b: HistoricalRecord) => a.date - b.date);
      console.log("[health-data] fetchHistoryData - Populated historyData, count:", historyData.value.length);
    } else {
      historyData.value = [];
      console.warn('[health-data] fetchHistoryData - Historical data format incorrect or empty. Payload:', JSON.parse(JSON.stringify(historyPayload)));
    }
    await nextTick();
    updateChartOptions();
  } catch (err: unknown) {
    console.error('[health-data] fetchHistoryData - Error caught:', err);
    if (err instanceof Error) {
      error.value = err.message;
    } else if (typeof err === 'string') {
      error.value = err;
    } else {
      error.value = '获取历史数据时发生错误，请稍后重试';
    }
    historyData.value = [];
    await nextTick(); // Ensure UI updates if historyData was cleared due to error
    updateChartOptions(); // Update chart with empty data if necessary
  }
}

const retryDataFetch = async () => {
  console.log("[health-data] retryDataFetch - Called.");
  error.value = '';
  isLoading.value = true;
  try {
    await fetchUserHealthData();
    await fetchHistoryData(); // fetchHistoryData now has internal checks for bodyData.value.id
  } catch (err: unknown) {
    console.error("[health-data] retryDataFetch - Error caught during retry:", err);
    if (err instanceof Error) {
        error.value = err.message;
    } else {
        error.value = "重试数据获取失败";
    }
  } finally {
    console.log('[health-data] retryDataFetch finally: setting isLoading to false. Current error:', error.value);
    isLoading.value = false;
    await nextTick();
    if (chartContainer.value) {
        if (chartInstance) {
            console.log("[health-data] retryDataFetch - Disposing existing chartInstance.");
            chartInstance.dispose();
            chartInstance = null;
        }
        console.log("[health-data] retryDataFetch - Initializing chart.");
        initChart();
    } else {
        console.warn("[health-data] retryDataFetch - Chart container not available after nextTick.");
    }
  }
};

onMounted(async () => {
  console.log("[health-data] onMounted - Called.");
  isLoading.value = true;
  try {
    await fetchUserHealthData();
    await fetchHistoryData(); // fetchHistoryData now has internal checks for bodyData.value.id
  } catch (err: unknown) {
    console.error('[health-data] onMounted - Error caught during initial data fetch:', err);
    if (err instanceof Error) {
        error.value = err.message;
    } else {
        error.value = '加载页面时发生错误，请刷新页面重试';
    }
  }
  finally {
    console.log('[health-data] onMounted finally: setting isLoading to false. Current error:', error.value);
    isLoading.value = false;
    await nextTick();
    if (chartContainer.value) {
      console.log("[health-data] onMounted - Initializing chart and observing theme.");
      initChart();
      observeThemeChange();
    } else {
      console.warn("[health-data] onMounted - Chart container not available after nextTick.");
    }
  }
});

onUnmounted(() => {
  chartInstance?.dispose();
  if (chartContainer.value && resizeObserver) resizeObserver.unobserve(chartContainer.value);
  themeObserver?.disconnect();
  resizeObserver = null;
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
  }
}, { deep: true });

const getBmiComment = (bmiValue: number): string => {
  if (bmiValue < 18.5) return '偏轻';
  if (bmiValue < 24.9) return '正常';
  if (bmiValue < 29.9) return '过重';
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

// 以下计算属性已替换为方法
// const healthIndexText = computed(() => {
//   const index = healthIndex.value;
//   if (index >= 80) return '优秀';
//   if (index >= 60) return '良好';
//   return '需要改善';
// });

// const healthIndexClass = computed(() => {
//   const index = healthIndex.value;
//   if (index >= 80) return 'text-green-500';
//   if (index >= 60) return 'text-yellow-500';
//   return 'text-red-500';
// });

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

const getBmiColorClass = (bmiValue: number): string => {
  if (bmiValue < 18.5) return 'text-green-500';
  if (bmiValue < 24.9) return 'text-yellow-500';
  if (bmiValue < 28) return 'text-yellow-500';
  return 'text-red-500';
};

const getBmiBackgroundClass = (bmiValue: number): string => {
  if (bmiValue < 18.5) return 'bg-green-500';
  if (bmiValue < 24.9) return 'bg-yellow-500';
  if (bmiValue < 28) return 'bg-yellow-500';
  return 'bg-red-500';
};

const calculateBmiPosition = (bmiValue: number): number => {
  // 将BMI值映射到0-100%的位置
  const minBmi = 15; // 最小BMI值
  const maxBmi = 40; // 最大BMI值
  const position = ((bmiValue - minBmi) / (maxBmi - minBmi)) * 100;
  return Math.min(Math.max(position, 0), 100); // 确保在0-100%范围内
};

const bodyType = computed(() => {
  if (bmi.value < 18.5) return '偏瘦';
  if (bmi.value < 24.9) return '正常';
  if (bmi.value < 28) return '超重';
  return '肥胖';
});

const obesityHealthRisk = computed(() => {
  if (bmi.value < 18.5) return '体重偏轻，可能存在营养不良或贫血等问题。';
  if (bmi.value < 24.9) return '体重正常，保持良好的健康状态。';
  if (bmi.value < 28) return '体重过重，可能存在心血管疾病、糖尿病等健康风险。';
  return '肥胖，可能存在多种健康风险，如心血管疾病、糖尿病等。';
});

const bodyTypeSuggestion = computed(() => {
  if (bmi.value < 18.5) return '建议增加营养摄入，多吃高蛋白、高纤维的食物，保持健康饮食。';
  if (bmi.value < 24.9) return '保持良好的生活习惯，继续保持健康的饮食和运动习惯。';
  if (bmi.value < 28) return '建议减少高热量食物摄入，增加有氧运动，控制体重。';
  return '建议减少高热量食物摄入，增加有氧运动，控制体重，并咨询专业医生。';
});

const calculatedRisk = computed(() => {
  if (!bodyData.value) return "数据加载中或加载失败";
  const risks = [];

  // 血压风险判断
  if (bodyData.value.bloodPressure) {
    const bpValue = parseInt(bodyData.value.bloodPressure);
    if (bpValue >= 140) {
      risks.push("高血压风险");
    } else if (bpValue < 90 && bpValue > 0) {
      risks.push("低血压风险");
    }
  }

  // 其他风险
  const info = bodyData.value;
  if (info.bloodLipid && parseFloat(info.bloodLipid) > 5.2) risks.push("高血脂风险");
  if (info.bloodSugar > 6.1 && info.bloodSugar < 7.0) risks.push("空腹血糖受损风险");
  if (info.bloodSugar >= 7.0) risks.push("糖尿病风险");
  if (info.heartRate > 100) risks.push("静息心率过快");
  if (info.heartRate < 60 && info.heartRate > 0) risks.push("静息心率过缓");

  // 视力风险
  if (info.vision && info.vision >= 300) risks.push("近视相关眼病风险");

  // 体型风险
  if (bmi.value >= 24) risks.push("超重/肥胖相关疾病风险");
  if (bmi.value < 18.5) risks.push("体重过轻相关风险");

  // 生活习惯直接风险
  if (info.smoking === true) risks.push("吸烟相关疾病风险");
  if (info.drinking === true) risks.push("过量饮酒风险");
  if (info.exercise === false) risks.push("缺乏运动风险");
  if (info.sleepDuration && info.sleepDuration < 7) risks.push("睡眠不足风险");
  if (info.sleepQuality === "差") risks.push("睡眠质量差风险");
  if (info.waterConsumption && info.waterConsumption < 1500) risks.push("饮水不足风险");

  return risks.length > 0 ? risks.join("，") : "暂未发现明显风险项";
});

const calculatedHabits = computed(() => {
  if (!bodyData.value) return "数据加载中或加载失败";
  const habitsList = [];
  const info = bodyData.value;

  // 饮食偏好
  if (info.foodTypes && typeof info.foodTypes === 'string') {
    habitsList.push(`饮食偏好: ${info.foodTypes.trim()}`);
  } else {
    habitsList.push("饮食偏好未记录");
  }

  // 作息与睡眠
  if (typeof info.sleepDuration === 'number') {
    habitsList.push(`平均睡眠时长: ${info.sleepDuration.toFixed(1)} 小时` + (info.sleepDuration < 7 ? " (可能不足)" : ""));
  } else {
    habitsList.push("睡眠时长未记录");
  }

  if (info.sleepQuality && typeof info.sleepQuality === 'string' && info.sleepQuality.trim() !== '') {
    habitsList.push(`睡眠质量自评: ${info.sleepQuality.trim()}` + (info.sleepQuality === "差" ? " (有待改善)" : ""));
  } else {
    habitsList.push("睡眠质量未记录");
  }

  // 运动习惯
  if (info.exercise === true) {
    habitsList.push("有运动习惯");
  } else if (info.exercise === false) {
    habitsList.push("缺乏运动");
  } else {
    habitsList.push("运动习惯未记录");
  }

  // 饮水习惯
  if (typeof info.waterConsumption === 'number') {
    habitsList.push(`日均饮水: ${Math.round(info.waterConsumption)} ml` + (info.waterConsumption < 1500 ? " (可能不足)" : ""));
  } else {
    habitsList.push("饮水量未记录");
  }

  // 不良嗜好
  if (info.smoking === true) {
    habitsList.push("有吸烟习惯");
  } else if (info.smoking === false) {
    habitsList.push("无吸烟习惯");
  } else {
    habitsList.push("吸烟情况未记录");
  }

  if (info.drinking === true) {
    habitsList.push("有饮酒习惯");
  } else if (info.drinking === false) {
    habitsList.push("无饮酒习惯");
  } else {
    habitsList.push("饮酒情况未记录");
  }

  return habitsList.length > 0 ? habitsList.join("； ") : "暂无足够信息评估生活习惯";
});

const calculatedBMR = computed(() => {
  const info = bodyData.value;
  if (!info || typeof info.weight !== 'number' || info.weight <= 0
    || typeof info.height !== 'number' || info.height <= 0
    || typeof info.age !== 'number' || info.age <= 0
    || typeof info.gender !== 'string' || !info.gender) {
    return 0; // 必要信息不全
  }

  const weight = info.weight;
  const heightCm = info.height; // 假设身高已经是厘米单位
  const age = info.age;
  const gender = info.gender.toLowerCase(); // 转小写以便比较
  let bmr;

  // Harris-Benedict 公式 (修正版)
  if (gender === '男' || gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age);
  } else if (gender === '女' || gender === 'female') {
    bmr = 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age);
  } else {
    return 0; // 性别不识别
  }

  return bmr > 0 ? Math.round(bmr) : 0; // 返回正数 BMR 或 0
});

// 恢复综合健康评分计算属性，用于健康指数显示
const calculatedHealthScore = computed(() => {
  if (!bodyData.value.id) return 0;
  const scores = detailedScores.value;
  const total = (
    scores.bmiScore * 2 +
    scores.bloodSugarScore * 2 +
    scores.bloodPressureScore * 2 +
    scores.heartRateScore * 2 +
    scores.lifestyleScore * 1.5 +
    scores.bloodLipidScore * 1.5
  ) / 11;
  return Math.round(Math.max(0, Math.min(100, total)));
});

// 由于删除了综合健康评分板块，下面的计算属性不再需要
// const healthScoreLevel = computed(() => {
//   const score = calculatedHealthScore.value;
//   if (score >= 90) return '优秀';
//   if (score >= 80) return '良好';
//   if (score >= 70) return '一般';
//   if (score >= 60) return '较差';
//   return '差';
// });

// const healthScoreCircleColor = computed(() => {
//   const score = calculatedHealthScore.value;
//   if (score >= 90) return 'stroke-green-500';
//   if (score >= 80) return 'stroke-blue-500';
//   if (score >= 70) return 'stroke-yellow-500';
//   if (score >= 60) return 'stroke-orange-500';
//   return 'stroke-red-500';
// });

// const healthScoreTextColor = computed(() => {
//   const score = calculatedHealthScore.value;
//   if (score >= 90) return '#10b981'; // 绿色
//   if (score >= 80) return '#3b82f6'; // 蓝色
//   if (score >= 70) return '#f59e0b'; // 黄色
//   if (score >= 60) return '#f97316'; // 橙色
//   return '#ef4444'; // 红色
// });

// const healthScoreLevelColor = computed(() => {
//   const score = calculatedHealthScore.value;
//   if (score >= 90) return 'text-green-500';
//   if (score >= 80) return 'text-blue-500';
//   if (score >= 70) return 'text-yellow-500';
//   if (score >= 60) return 'text-orange-500';
//   return 'text-red-500';
// });

// 获取评分项名称 - 不再需要
// const getScoreName = (name: string): string => {
//   const nameMap: { [key: string]: string } = {
//     bmiScore: 'BMI',
//     bloodSugarScore: '血糖',
//     bloodPressureScore: '血压',
//     heartRateScore: '心率',
//     lifestyleScore: '生活习惯',
//     bloodLipidScore: '血脂'
//   };
//   return nameMap[name] || name;
// };

// 根据分数获取颜色 - 不再需要
// const getScoreColor = (score: number): string => {
//   if (score >= 90) return '#10b981'; // 绿色
//   if (score >= 80) return '#3b82f6'; // 蓝色
//   if (score >= 70) return '#f59e0b'; // 黄色
//   if (score >= 60) return '#f97316'; // 橙色
//   return '#ef4444'; // 红色
// };

const getVisionTypeColor = (visionType: string): string => {
  if (visionType === '正常' || visionType === '轻度近视') return 'text-green-500';
  if (visionType === '中度近视') return 'text-yellow-500';
  if (visionType === '高度近视') return 'text-red-500';
  return 'text-gray-500'; // 未知或无数据
};

const getVisionMarkerClass = (vision: number): string => {
  if (!vision) return 'bg-gray-500';
  if (vision < 300) return 'bg-green-500';
  if (vision < 600) return 'bg-yellow-500';
  return 'bg-red-500';
};

const calculateVisionPosition = (vision: number): number => {
  if (!vision) return 0;
  // 视力度数映射到位置百分比
  // 0度 -> 0%，600度 -> 66%，1000度+ -> 100%
  const maxVision = 1000;
  const position = Math.min(100, (vision / maxVision) * 100);
  return position;
};

const visionType = computed(() => {
  const vision = bodyData.value.vision;
  if (!vision) return '无数据';
  if (vision === 0) return '正常';
  if (vision < 300) return '轻度近视';
  if (vision < 600) return '中度近视';
  return '高度近视';
});

const visionSuggestion = computed(() => {
  const vision = bodyData.value.vision;
  if (!vision) return '请先记录您的视力数据，定期检查视力可以及时发现问题。';
  if (vision === 0) return '您的视力状况良好，继续保持良好的用眼习惯，避免长时间使用电子设备。';
  if (vision < 300) return '您的视力状况为轻度近视，建议定期检查视力，并注意用眼卫生，每隔一小时休息眼睛5-10分钟。';
  if (vision < 600) return '您的视力状况为中度近视，建议定期到眼科进行专业检查，控制用眼时间，增加户外活动，必要时进行视力矫正。';
  return '您的视力状况为高度近视，建议尽快到眼科进行全面检查，关注眼底健康，严格控制用眼时间，遵医嘱采取合适的矫正方式。';
});

// 根据健康指数获取颜色类名
const getHealthIndexClass = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

// 根据健康指数获取等级文本
const getHealthIndexText = (score: number): string => {
  if (score >= 80) return '优秀';
  if (score >= 60) return '良好';
  return '需要改善';
};

// 添加表单相关变量
const showUserInfoDialog = ref(false);
const isFormSubmitting = ref(false);
const userInfoForm = ref<Partial<BodyDataType>>({
  name: '',
  age: null,
  gender: '男',
  height: null,
  weight: null,
  bloodSugar: null,
  bloodPressure: '',
  bloodLipid: '',
  heartRate: null,
  vision: null,
  sleepDuration: null,
  sleepQuality: 2, // 默认一般
  smoking: false,
  drinking: false,
  exercise: false,
  foodTypes: [],
  waterConsumption: null,
});

const formErrors = ref<Record<string, string>>({});

// 睡眠质量选项
const sleepQualityOptions = [
  { value: 1, label: '好' },
  { value: 2, label: '一般' },
  { value: 3, label: '差' },
];

// 食物选项
const foodOptions = [
  { value: '蔬菜', label: '蔬菜' },
  { value: '水果', label: '水果' },
  { value: '肉类', label: '肉类' },
  { value: '鱼类', label: '鱼类' },
  { value: '豆类', label: '豆类' },
  { value: '谷物', label: '谷物' },
  { value: '其他', label: '其他' },
];

// 表单验证
const validateUserInfoForm = (): boolean => {
  formErrors.value = {};
  let isValid = true;

  if (!userInfoForm.value.name || userInfoForm.value.name.length < 2 || userInfoForm.value.name.length > 20) {
    formErrors.value.name = '姓名长度需在 2 到 20 个字符';
    isValid = false;
  }
  if (userInfoForm.value.age === null || userInfoForm.value.age === undefined || userInfoForm.value.age <= 0 || userInfoForm.value.age > 150) {
    formErrors.value.age = '请输入有效的年龄 (1-150)';
    isValid = false;
  }
  if (!userInfoForm.value.gender) {
    formErrors.value.gender = '请选择性别';
    isValid = false;
  }
  if (userInfoForm.value.height === null || userInfoForm.value.height === undefined || userInfoForm.value.height <= 0 || userInfoForm.value.height > 300) {
    formErrors.value.height = '请输入有效身高 (cm)';
    isValid = false;
  }
  if (userInfoForm.value.weight === null || userInfoForm.value.weight === undefined || userInfoForm.value.weight <= 0 || userInfoForm.value.weight > 500) {
    formErrors.value.weight = '请输入有效体重 (kg)';
    isValid = false;
  }

  return isValid;
};

// 关闭用户信息弹窗
const closeUserInfoDialog = () => {
  // 询问是否保存当前输入数据
  if (userInfoForm.value.name || userInfoForm.value.height || userInfoForm.value.weight) {
    const confirmed = window.confirm('是否保存当前输入的数据？下次填写时将自动加载。');
    if (confirmed) {
      try {
        localStorage.setItem('healthDataCache', JSON.stringify(userInfoForm.value));
      } catch (e) {
        console.error('保存用户数据到缓存失败:', e);
      }
    }
  }
  showUserInfoDialog.value = false;
};

// 提交用户信息表单
const submitUserInfoForm = async () => {
  if (!validateUserInfoForm()) {
    error.value = '请检查表单填写是否正确';
    showNotification('warning', '请检查表单填写是否正确');
    return;
  }

  isFormSubmitting.value = true;
  try {
    const submissionData = { ...userInfoForm.value };
    if (Array.isArray(submissionData.foodTypes)) {
      submissionData.foodTypes = submissionData.foodTypes.join(',');
    }

    await addBodyInformationNotes(submissionData);

    showNotification('success', '健康信息已成功记录！');

    try {
      localStorage.setItem('healthDataCache', JSON.stringify(userInfoForm.value));
    } catch (e) {
      console.error('保存用户数据到缓存失败:', e);
    }

    showUserInfoDialog.value = false;
    await retryDataFetch();

  } catch (err: unknown) { // 使用 unknown 类型
    console.error('提交表单失败 (submitUserInfoForm):', err);
    let errorMessageToShow = '提交健康信息失败，请重试';
    if (err instanceof Error) {
      errorMessageToShow = err.message;
    } else if (typeof err === 'string') {
      errorMessageToShow = err;
    }
    error.value = errorMessageToShow;
    showNotification('error', errorMessageToShow );
  } finally {
    isFormSubmitting.value = false;
  }
};

// ... (文件的其余部分，包括 onMounted, fetchHistoryData, retryDataFetch 等，它们的 isLoading 管理需要协调)
// 确保 retryDataFetch 和 onMounted 中的 finally 块正确设置 isLoading.value = false;
// onMounted 和 retryDataFetch 内部调用 fetchUserHealthData 和 fetchHistoryData 后，
// 再在它们自己的 finally 中设置 isLoading.value = false.

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

/* 卡片悬停效果 */
.bg-white,
.bg-gray-50 {
  transition: all 0.3s ease-in-out;
}

.bg-white:hover,
.bg-gray-50:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 进度条动画 */
.rounded-full {
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 页面滚动时的淡入效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.health-dashboard>div>div:not(:first-child) {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* 调整各部分的延迟出现效果 */
.health-dashboard>div>div:nth-child(2) {
  animation-delay: 0.1s;
}

.health-dashboard>div>div:nth-child(3) {
  animation-delay: 0.2s;
}

.health-dashboard>div>div:nth-child(4) {
  animation-delay: 0.3s;
}

.health-dashboard>div>div:nth-child(5) {
  animation-delay: 0.4s;
}

.health-dashboard>div>div:nth-child(6) {
  animation-delay: 0.5s;
}

.health-dashboard>div>div:nth-child(7) {
  animation-delay: 0.6s;
}

.health-dashboard>div>div:nth-child(8) {
  animation-delay: 0.7s;
}

/* 健康指数圆形渐变效果 */
@keyframes gradientRotate {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.text-5xl.font-bold[style*="background"] {
  background-size: 200% 200%;
  animation: gradientRotate 5s ease infinite;
}
</style>

