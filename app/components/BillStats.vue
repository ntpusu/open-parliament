<template>
  <section
    aria-labelledby="bill-stats-heading"
    class="rounded-lg bg-gray-50 p-6 dark:bg-gray-800 sm:p-8"
  >
    <h2
      id="bill-stats-heading"
      class="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white"
    >
      議案統計
    </h2>

    <p v-if="error" role="status" class="text-center text-sm text-gray-600 dark:text-gray-400">
      統計資料暫時無法載入，請稍後重新整理頁面。
    </p>

    <template v-else>
      <!-- 摘要數字 -->
      <dl class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          v-for="item in summary"
          :key="item.label"
          class="rounded-lg border border-gray-200 bg-white p-5 text-center dark:border-gray-700 dark:bg-gray-900"
        >
          <dt class="text-sm text-gray-600 dark:text-gray-400">{{ item.label }}</dt>
          <dd class="mt-1 text-3xl font-bold tabular-nums text-primary dark:text-primary-200">
            <template v-if="item.value !== null">{{ item.value }}</template>
            <span
              v-else
              class="inline-block h-9 w-16 animate-pulse rounded bg-gray-200 align-middle dark:bg-gray-700"
              aria-hidden="true"
            ></span>
          </dd>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ item.note }}</p>
        </div>
      </dl>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 各屆議案數 -->
        <figure
          class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <figcaption class="text-sm font-semibold text-gray-900 dark:text-white">
            各屆議案數
          </figcaption>
          <div
            v-if="loading"
            class="mt-4 h-48 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
            aria-hidden="true"
          ></div>
          <p v-else-if="!termBars.length" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            尚無資料
          </p>
          <template v-else>
            <ol class="mt-8 flex items-end gap-2 sm:gap-3">
              <li v-for="item in termBars" :key="item.term" class="min-w-0 flex-1">
                <span class="sr-only">第 {{ item.term }} 屆：{{ item.count }} 件</span>
                <div class="relative h-40 w-full" aria-hidden="true">
                  <span
                    class="absolute inset-x-0 text-center text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300"
                    :style="{ bottom: `calc(${item.percent}% + 0.25rem)` }"
                  >
                    {{ item.count }}
                  </span>
                  <div
                    class="absolute inset-x-0 bottom-0 rounded-t"
                    :class="
                      item.isCurrent
                        ? 'bg-primary dark:bg-primary-200'
                        : 'bg-primary-400 dark:bg-primary-400/70'
                    "
                    :style="{ height: `${item.percent}%` }"
                  ></div>
                </div>
                <div
                  class="mt-2 border-t border-gray-300 pt-1 text-center text-xs dark:border-gray-600"
                  :class="
                    item.isCurrent
                      ? 'font-semibold text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  "
                  aria-hidden="true"
                >
                  {{ item.term }}
                </div>
              </li>
            </ol>
            <p class="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
              屆次（粗體標示本屆）
            </p>
          </template>
        </figure>

        <!-- 議案類型分布 -->
        <figure
          class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900"
        >
          <figcaption class="text-sm font-semibold text-gray-900 dark:text-white">
            議案類型分布（歷屆合計）
          </figcaption>
          <div
            v-if="loading"
            class="mt-4 h-48 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
            aria-hidden="true"
          ></div>
          <p v-else-if="!typeBars.length" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            尚無資料
          </p>
          <ul v-else class="mt-4 space-y-3">
            <li v-for="item in typeBars" :key="item.type">
              <div class="flex items-baseline justify-between gap-3 text-sm">
                <span class="min-w-0 truncate text-gray-800 dark:text-gray-200">
                  {{ item.type }}
                </span>
                <span class="shrink-0 tabular-nums text-gray-600 dark:text-gray-400">
                  {{ item.count }} 件・{{ item.percentLabel }}%
                </span>
              </div>
              <div
                class="mt-1 h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                aria-hidden="true"
              >
                <div
                  class="h-full rounded-full bg-primary-400 dark:bg-primary-300"
                  :style="{ width: `${item.percent}%` }"
                ></div>
              </div>
            </li>
          </ul>
        </figure>
      </div>
    </template>
  </section>
</template>

<script setup>
  import { computed } from 'vue';
  import { getEarliestTerm } from '~~/shared/utils/term';

  const props = defineProps({
    // /api/bills/stats 回傳的 data；尚未載入時為 null
    stats: { type: Object, default: null },
    error: { type: [Object, Boolean, null], default: null },
  });

  // 類型過多時只顯示前幾名，其餘合併為「其他」，避免圖表過長
  const MAX_TYPES = 6;

  const loading = computed(() => !props.stats && !props.error);

  const summary = computed(() => {
    const s = props.stats;
    return [
      {
        label: '總議案數',
        value: s ? Number(s.totalBills).toLocaleString('zh-TW') : null,
        note: `第 ${getEarliestTerm()} 屆起累計`,
      },
      {
        label: '目前屆次',
        value: s ? `第 ${s.currentTerm} 屆` : null,
        note: '每年 7 月 1 日換屆',
      },
      {
        label: '本屆議案數',
        value: s ? Number(s.thisTermBills).toLocaleString('zh-TW') : null,
        note: s?.currentTerm ? `第 ${s.currentTerm} 屆` : '',
      },
    ];
  });

  const termBars = computed(() => {
    const rows = props.stats?.byTerm ?? [];
    const max = Math.max(...rows.map((r) => r.count), 0);
    if (!max) return [];
    return rows.map((r) => ({
      ...r,
      isCurrent: r.term === props.stats.currentTerm,
      // 有議案但占比極小時仍保留可見的最小高度
      percent: r.count ? Math.max((r.count / max) * 100, 2) : 0,
    }));
  });

  const typeBars = computed(() => {
    const rows = props.stats?.byType ?? [];
    const total = rows.reduce((sum, r) => sum + r.count, 0);
    if (!total) return [];

    let shown = rows;
    if (rows.length > MAX_TYPES) {
      const rest = rows.slice(MAX_TYPES - 1);
      shown = [
        ...rows.slice(0, MAX_TYPES - 1),
        { type: '其他', count: rest.reduce((sum, r) => sum + r.count, 0) },
      ];
    }
    return shown.map((r) => ({
      ...r,
      percent: (r.count / total) * 100,
      percentLabel: (Math.round((r.count / total) * 1000) / 10).toFixed(1),
    }));
  });
</script>
