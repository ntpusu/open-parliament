<template>
  <!-- 全站公告：說明本站僅收錄第 23 至 26 屆資料，第 27 屆起改至新議事服務系統 -->
  <section
    aria-label="資料範圍公告"
    class="border-b border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100"
  >
    <div class="container mx-auto px-4 py-3 text-sm leading-relaxed">
      {{ message
      }}<a
        :href="EXTERNAL_LINKS.parliamentSystem"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-300"
        >議事服務系統<span class="sr-only">（另開新視窗）</span></a
      >查詢。
    </div>
  </section>
</template>

<script setup lang="ts">
  import { getEarliestTerm, getLatestTerm } from '~~/shared/utils/term';
  import { EXTERNAL_LINKS } from '~~/shared/utils/constants';

  // 以字串組合文字，避免模板換行在中文之間產生多餘空白
  const message =
    `本站僅收錄第 ${getEarliestTerm()} 屆至第 ${getLatestTerm()} 屆之議事資料。` +
    `自第 ${getLatestTerm() + 1} 屆起，議案等資料改由學生議會議長開發之議事服務系統公開，請至`;
</script>
