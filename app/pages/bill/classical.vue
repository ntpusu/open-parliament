<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">即時查詢議案</h1>
      <p class="text-gray-600 dark:text-gray-300">經典介面，提供歷屆所有議案即時查詢</p>
    </div>

    <!-- AppSheet 資料庫不另行清理，故於此說明其資料範圍與本站不同 -->
    <div
      role="note"
      class="mx-auto mb-6 max-w-[1000px] rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100"
    >
      <p class="font-semibold">關於本介面之資料範圍</p>
      <p class="mt-1">
        {{ appSheetNotice
        }}<a
          :href="EXTERNAL_LINKS.parliamentSystem"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-300"
          >議事服務系統<span class="sr-only">（另開新視窗）</span></a
        >所載為準。
      </p>
    </div>

    <div class="w-full max-w-[1000px] h-[450px] mx-auto bg-primary-100">
      <iframe
        title="議案即時查詢系統（AppSheet）"
        src="https://www.appsheet.com/start/44df5ea0-8f78-4d04-b897-79d7ca662248"
        width="100%"
        height="450"
      />
    </div>

    <div class="mt-12 text-center text-gray-500 dark:text-gray-400">
      <p>
        如果在網頁中看不到提案查詢系統畫面，請您<a
          href="https://www.appsheet.com/start/44df5ea0-8f78-4d04-b897-79d7ca662248"
          target="_blank"
          rel="noopener noreferrer"
          >直接點選連結</a
        >瀏覽。
      </p>
      <p>本站收錄範圍：第 {{ getEarliestTerm() }} 屆至第 {{ getLatestTerm() }} 屆。</p>
    </div>

    <!-- 新版查詢系統連結 -->
    <div class="mt-8 text-center">
      <NuxtLink
        to="/bill"
        rel="noopener noreferrer"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-400"
      >
        新版查詢介面
        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
  import { getEarliestTerm, getLatestTerm } from '~~/shared/utils/term';
  import { EXTERNAL_LINKS } from '~~/shared/utils/constants';

  // 以字串組合文字，避免模板換行在中文之間產生多餘空白
  const appSheetNotice =
    `下方嵌入之 AppSheet 查詢介面仍含有第 ${getLatestTerm() + 1} 屆以後之議案資料，` +
    `惟該部分不在本站收錄範圍（第 ${getEarliestTerm()} 至 ${getLatestTerm()} 屆）內，` +
    `本站不保證其正確與完整。第 ${getLatestTerm() + 1} 屆起之議案，請以`;
  // SEO 設定（definePageMeta 的 title 不會寫入 <head>，須使用 useSeoMeta）
  useSeoMeta({
    title: '傳統查詢介面',
    description: `以 AppSheet 經典介面查詢${ORG_DATA.nameZhFull}歷屆議案資料。`,
  });
</script>

<style scoped>
  .container {
    max-width: 1200px;
  }
</style>
