<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 列印專用標題 -->
    <div class="hidden print:block text-center mb-8">
      <h1 class="text-2xl font-bold">{{ ORG_DATA.nameZhFull }}提案資料</h1>
    </div>

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

    <div v-if="status !== 'pending' && !error && bill" class="space-y-6">
      <!-- ===== 螢幕版 ===== -->
      <div class="space-y-6 print:hidden">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <span
            v-if="bill.billType"
            class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {{ bill.billType }}
          </span>
          <h1 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{{ bill.billNumber }}</h1>
          <p class="mt-2 text-lg text-gray-700 dark:text-gray-300">{{ bill.subject }}</p>

          <dl class="mt-5 grid gap-x-8 gap-y-3 border-t border-gray-100 pt-4 text-sm dark:border-gray-700 sm:grid-cols-2">
            <div>
              <dt class="text-gray-500 dark:text-gray-400">提案者</dt>
              <dd class="mt-0.5 font-medium text-gray-900 dark:text-white">{{ proposerText || '無' }}</dd>
            </div>
            <div>
              <dt class="text-gray-500 dark:text-gray-400">提案時間</dt>
              <dd class="mt-0.5 font-medium text-gray-900 dark:text-white">{{ bill.submittedAt || '無' }}</dd>
            </div>
            <div v-if="bill.scheduledSession">
              <dt class="text-gray-500 dark:text-gray-400">排入會議</dt>
              <dd class="mt-0.5 font-medium text-gray-900 dark:text-white">{{ bill.scheduledSession }}</dd>
            </div>
          </dl>
        </div>

        <section class="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          <div class="p-6">
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400">說明</h2>
            <div class="mt-2 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
              <p
                v-for="(line, i) in descriptionLines"
                :key="i"
                :style="line.hanging ? { textIndent: '-2em', marginLeft: '2em' } : undefined"
              >
                {{ line.text }}
              </p>
              <p v-if="!descriptionLines.length" class="text-gray-500 dark:text-gray-400">無</p>
            </div>
          </div>
          <div class="p-6">
            <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400">辦法</h2>
            <p class="mt-2 whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-200">
              {{ bill.proposedAction || '無' }}
            </p>
          </div>
        </section>

        <section class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400">附件</h2>
          <ul v-if="attachments.length" class="mt-3 space-y-2">
            <li v-for="(attachment, i) in attachments" :key="i">
              <a
                :href="attachment.url"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-primary transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-gray-700 dark:text-primary-400 dark:hover:bg-gray-700/50"
              >
                <DocumentIcon class="h-5 w-5 shrink-0" />
                <span class="min-w-0 flex-1 break-words">{{ attachment.name }}</span>
                <ArrowTopRightOnSquareIcon class="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100" />
              </a>
            </li>
          </ul>
          <p v-else class="mt-2 text-gray-500 dark:text-gray-400">無附件</p>
        </section>
      </div>

      <!-- ===== 列印版：維持原本的表格 ===== -->
      <div class="hidden overflow-hidden rounded-lg border border-gray-200 print:block">
        <table class="w-full">
          <tbody>
            <tr v-for="field in printFields" :key="field.key" class="border-b border-gray-200 last:border-b-0">
              <td class="w-1/4 whitespace-nowrap px-6 py-4 text-sm font-medium">{{ field.label }}</td>
              <td class="px-6 py-4 text-sm">
                <div v-if="field.key === 'attachments'" class="break-all">
                  <span
                    v-for="(attachment, i) in attachments"
                    :key="i"
                    class="block"
                    style="text-indent: -1em; margin-left: 1em"
                  >
                    附件 {{ i + 1 }}：{{ attachment.url }}
                  </span>
                  <span v-if="!attachments.length">無附件</span>
                </div>
                <div v-else-if="field.key === 'description'" class="whitespace-pre-wrap">
                  <p
                    v-for="(line, i) in descriptionLines"
                    :key="i"
                    :style="line.hanging ? { textIndent: '-2em', marginLeft: '2em' } : undefined"
                  >
                    {{ line.text }}
                  </p>
                  <template v-if="!descriptionLines.length">無</template>
                </div>
                <div v-else class="whitespace-pre-wrap">{{ getField(field.key) || '無' }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 下排按鈕：列印時隱藏 -->
      <div class="flex flex-wrap gap-3 print:hidden">
        <NuxtLink :to="`/bill/${term}`" :class="actionButtonClass">
          <ChevronLeftIcon class="mr-2 h-4 w-4" />
          返回議案清單
        </NuxtLink>
        <button type="button" :class="actionButtonClass" @click="copyUrl">
          <LinkIcon class="mr-2 h-4 w-4" />
          複製連結
        </button>
        <button type="button" :class="actionButtonClass" @click="printPage">
          <PrinterIcon class="mr-2 h-4 w-4" />
          列印
        </button>
      </div>
    </div>

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

    <div
      v-if="showCopySuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 print:hidden"
    >
      連結已複製到剪貼簿
    </div>

    <!-- 列印專用結尾 -->
    <div class="hidden print:block text-sm text-gray-700 mt-12" style="word-break: break-all">
      <div>
        {{ printFooterText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import {
    ExclamationTriangleIcon,
    DocumentTextIcon,
    DocumentIcon,
    ArrowTopRightOnSquareIcon,
    ChevronLeftIcon,
    LinkIcon,
    PrinterIcon,
  } from '@heroicons/vue/24/outline';
  import { getCurrentTerm } from '#imports';
  import { useRoute, createError, useFetch } from '#app';
  import { ORG_DATA } from '~/utils/constants';
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
      bill.value?.subject
        ? `${tempBillNumber.value}｜${bill.value.subject}`
        : tempBillNumber.value,
    ogTitle: () => tempBillNumber.value,
    ogDescription: () => bill.value?.subject || `${tempBillNumber.value}議案詳細資料`,
    description: () => bill.value?.subject || `${tempBillNumber.value}議案詳細資料`,
    ogSiteName: SITE_CONFIG.name,
    robots: 'noindex, nofollow',
  });


  // helper: 動態欄位取值（搭配 printFields 的 key）
  const getField = (fieldName: string): unknown => {
    if (!bill.value) return undefined;
    if (fieldName === 'proposingEntity') return formatProposer(bill.value);
    return (bill.value as unknown as Record<string, unknown>)[fieldName];
  };

  // 說明欄位：以「一、」「十一、」等開頭的行使用凸排
  const HANGING_LINE = /^[一二三四五六七八九十]+、/;

  const descriptionLines = computed(() => {
    const raw = String(bill.value?.description ?? '');
    if (!raw) return [];
    return raw.split(/\r?\n/).map((text) => ({ text, hanging: HANGING_LINE.test(text) }));
  });

  // 附件欄位：各附件編號、嘗試解析檔名或 Google Drive
  const getAttachments = (billData: Bill | null | undefined) => {
    if (!billData || !Array.isArray(billData.attachments)) return [];

    return billData.attachments
      .filter((attachmentString) => typeof attachmentString === 'string' && attachmentString.trim())
      .map((attachmentString, index) => {
        let name = `附件 ${index + 1}`; // Default name

        const url = attachmentString.startsWith('http')
          ? attachmentString
          : `https://${attachmentString}`;

        if (
          url.startsWith('https://drive.google.com/') ||
          url.startsWith('https://docs.google.com/')
        ) {
          // Google Drive 連結
          name = `附件 ${index + 1} (Google Drive 連結)`;
        } else {
          // 嘗試解析檔名
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];
            if (fileName) {
              name = decodeURIComponent(fileName);
            }
          } catch (e) {
            // URL 解析失敗則使用預設名稱
          }
        }

        return { name, url };
      });
  };

  // 複製連結功能
  const showCopySuccess = ref(false);

  const printFields = computed(() => [
    { label: '編號', key: 'billNumber' },
    { label: '提案時間', key: 'submittedAt' },
    { label: '提案者', key: 'proposingEntity' },
    { label: '類型', key: 'billType' },
    { label: '案由', key: 'subject', isMultiline: true },
    { label: '說明', key: 'description', isMultiline: true },
    { label: '辦法', key: 'proposedAction', isMultiline: true },
    { label: '附件', key: 'attachments' },
    { label: '排入會議', key: 'scheduledSession' },
  ]);

  const proposerText = computed(() => (bill.value ? formatProposer(bill.value) : ''));
  const attachments = computed(() => getAttachments(bill.value));

  const copyUrl = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showCopySuccess.value = true;
        setTimeout(() => {
          showCopySuccess.value = false;
        }, 2000);
      })
      .catch((err: unknown) => {
        console.error('Failed to copy URL:', err);
        alert('複製連結失敗，請手動複製。');
      });
  };

  // 列印功能
  const printPage = () => {
    if (typeof window === 'undefined') return;
    window.print();
  };

  // 列印頁尾資訊
  const printFooterText = computed(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `資料為${now.getFullYear() - 1911}年${now.getMonth() + 1}月${now.getDate()}日${pad(now.getHours())}時${pad(now.getMinutes())}分${pad(now.getSeconds())}秒`;
    return `${dateStr}自網址 ${typeof window !== 'undefined' ? window.location.href : ''} 載入。`;
  });

  const actionButtonClass =
    'inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700';
</script>

<style>
  /* filepath: bill/:term/:number */
  /* Tailwind 已有 print:hidden、print:block，這裡保險再補充一次 */
  @media print {
    .print\:hidden {
      display: none !important;
    }
    .print\:block {
      display: block !important;
    }
    body {
      font-family: 'Times New Roman', Times, '標楷體', 'DFKai-SB', serif !important;
    }
    /* 表格字體放大 */
    table,
    th,
    td {
      font-size: 1.1rem !important;
    }
    /* 標題欄（左欄）粗體、全黑 */
    td:first-child {
      font-weight: bold !important;
      color: #000 !important;
      background: none !important;
    }
    /* 資料欄（右欄）正常粗細、全黑 */
    td:not(:first-child) {
      font-weight: normal !important;
      color: #000 !important;
      background: none !important;
    }
  }
</style>
