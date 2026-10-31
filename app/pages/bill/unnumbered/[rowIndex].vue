<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 導覽列與麵包屑：列印時隱藏 -->
    <nav class="mb-6 print:hidden" aria-label="麵包屑">
      <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <NuxtLink to="/bill" class="hover:text-primary">議案查詢</NuxtLink>
        </li>
        <template v-if="bill?.term">
          <li aria-hidden="true">/</li>
          <li>
            <NuxtLink :to="`/bill/${bill.term}`" class="hover:text-primary">
              第{{ bill.term }}屆
            </NuxtLink>
          </li>
        </template>
        <li aria-hidden="true">/</li>
        <li class="text-gray-900 dark:text-white" aria-current="page">
          未編號（流水號第{{ rowIndex }}號）
        </li>
      </ol>
    </nav>

    <div
      v-if="error"
      class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg print:hidden"
    >
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-500 mr-2" />
        <p class="text-red-700 dark:text-red-300">找不到流水號第{{ rowIndex }}號之議案</p>
      </div>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center items-center py-12 print:hidden">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-300">載入中...</span>
    </div>

    <template v-if="status !== 'pending' && !error && bill">
      <p
        class="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200 print:hidden"
      >
        本議案秘書處尚未完成程序審查，故尚無「北大峽議字」編號，暫以議案總流水號識別。
      </p>
      <BillDetail :bill="bill" :heading="heading" :back-to="backTo" />
    </template>

    <div v-if="status !== 'pending' && !error && !bill" class="text-center py-12 print:hidden">
      <DocumentTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">找不到此議案</h2>
      <p class="text-gray-600 dark:text-gray-300">請確認議案流水號是否正確</p>
      <div class="mt-4">
        <NuxtLink
          to="/bill"
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          查看各屆議案
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { ExclamationTriangleIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';
  import type { Bill } from '~~/shared/types/bill';

  const route = useRoute();
  const rowIndex = parseInt(route.params.rowIndex as string, 10);

  if (!rowIndex || isNaN(rowIndex)) {
    throw createError({
      statusCode: 404,
      statusMessage: '議案總流水號欠缺或非數值',
    });
  }

  const { data: bill, status, error } = await useFetch<Bill>(`/api/bills/byRowIndex/${rowIndex}`);

  // 議案若已編號，導向正式的編號頁，避免舊連結停留在過時的頁面
  if (bill.value?.billNumber && bill.value.term && bill.value.serialNumber) {
    await navigateTo(`/bill/${bill.value.term}/${bill.value.serialNumber}`, { redirectCode: 302 });
  }

  const heading = `未編號議案（流水號第${rowIndex}號）`;
  const backTo = computed(() => (bill.value?.term ? `/bill/${bill.value.term}` : '/bill'));

  useSeoMeta({
    title: () => (bill.value?.subject ? `${heading}｜${bill.value.subject}` : heading),
    ogTitle: heading,
    ogDescription: () => bill.value?.subject || `${heading}詳細資料`,
    description: () => bill.value?.subject || `${heading}詳細資料`,
    robots: 'noindex, nofollow',
  });
</script>
