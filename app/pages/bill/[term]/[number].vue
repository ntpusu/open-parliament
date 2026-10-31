<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 導覽列與麵包屑：列印時隱藏 -->
    <nav class="mb-6 print:hidden">
      <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink to="/bill" class="hover:text-primary">議案查詢</NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink :to="`/bill/${term}`" class="hover:text-primary">第{{ term }}屆</NuxtLink>
        </li>
        <li>/</li>
        <li class="text-gray-900 dark:text-white">第{{ number }}號</li>
      </ol>
    </nav>

    <div
      v-if="error"
      class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg print:hidden"
    >
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-500 mr-2" />
        <p class="text-red-700 dark:text-red-300">找不到議案：{{ term }}屆第{{ number }}號</p>
        <p class="text-red-700 dark:text-red-300">{{ error.message || '載入資料失敗' }}</p>
      </div>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center items-center py-12 print:hidden">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-300">載入中...</span>
    </div>

    <BillDetail
      v-if="status !== 'pending' && !error && bill"
      :bill="bill"
      :heading="bill.billNumber"
      :back-to="`/bill/${term}`"
    />

    <div v-if="!pending && !error && !bill" class="text-center py-12 print:hidden">
      <DocumentTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">找不到此議案</h3>
      <p class="text-gray-600 dark:text-gray-300">請確認議案編號是否正確</p>
      <div class="mt-4">
        <NuxtLink
          :to="`/bill/${term}`"
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          查看第{{ term }}屆議案
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { ExclamationTriangleIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';
  import { getCurrentTerm } from '#imports';
  import { useRoute, createError, useFetch } from '#app';
  import type { Bill } from '~~/shared/types/bill';

  // 獲取路由參數
  const route = useRoute();
  const term = computed(() => parseInt(route.params.term as string));
  const number = computed(() => parseInt(route.params.number as string));

  if (!term.value || isNaN(term.value) || !number.value || isNaN(number.value)) {
    throw createError({
      statusCode: 404,
      statusMessage: '議案參數欠缺或非數值',
    });
  }

  const {
    data: bill,
    pending,
    status,
    error,
  } = await useFetch<Bill>(`/api/bills/${term.value}/${number.value}`);

  const tempBillNumber = computed(() => {
    if (bill.value?.billNumber) {
      return bill.value.billNumber;
    } else {
      return `第${getCurrentTerm()}屆未編號議案`;
    }
  });

  // SEO 設定
  useSeoMeta({
    title: () =>
      bill.value?.subject ? `${tempBillNumber.value}｜${bill.value.subject}` : tempBillNumber.value,
    ogTitle: () => tempBillNumber.value,
    ogDescription: () => bill.value?.subject || `${tempBillNumber.value}議案詳細資料`,
    description: () => bill.value?.subject || `${tempBillNumber.value}議案詳細資料`,
    ogSiteName: SITE_CONFIG.name,
    robots: 'noindex, nofollow',
  });
</script>
