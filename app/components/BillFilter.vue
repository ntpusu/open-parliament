<template>
  <div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
      <button
        type="button"
        class="flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :aria-expanded="!isCollapsed"
        :aria-controls="panelId"
        @click="isCollapsed = !isCollapsed"
      >
        篩選議案
        <svg
          :class="['transition-transform', isCollapsed ? 'rotate-0' : 'rotate-180']"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </h2>

    <form v-show="!isCollapsed" :id="panelId" class="mt-4" @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="flex flex-col md:col-span-2 lg:col-span-3">
          <label :for="`${panelId}-keyword`" :class="labelClass">關鍵字</label>
          <input
            :id="`${panelId}-keyword`"
            v-model="localFilters.keyword"
            type="search"
            :class="inputClass"
            placeholder="搜尋編號、案由、說明或辦法"
          />
        </div>

        <div class="flex flex-col">
          <label :for="`${panelId}-type`" :class="labelClass">提案類型</label>
          <select :id="`${panelId}-type`" v-model="localFilters.type" :class="inputClass">
            <option value="">全部類型</option>
            <option v-for="option in typeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label :for="`${panelId}-agency`" :class="labelClass">提案機關/議員</label>
          <select :id="`${panelId}-agency`" v-model="localFilters.agency" :class="inputClass">
            <option value="">全部提案者</option>
            <option v-for="option in agencyOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <label :for="`${panelId}-session`" :class="labelClass">排入會議</label>
          <input
            :id="`${panelId}-session`"
            v-model="localFilters.scheduledSession"
            type="search"
            :class="inputClass"
            placeholder="例如：臨時會"
          />
        </div>

        <div class="flex flex-col">
          <label :for="`${panelId}-from`" :class="labelClass">提案日期起</label>
          <input
            :id="`${panelId}-from`"
            v-model="localFilters.dateFrom"
            type="date"
            :class="inputClass"
          />
        </div>

        <div class="flex flex-col">
          <label :for="`${panelId}-to`" :class="labelClass">提案日期迄</label>
          <input
            :id="`${panelId}-to`"
            v-model="localFilters.dateTo"
            type="date"
            :class="inputClass"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          @click="clearFilters"
        >
          清除篩選
        </button>
        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary-400 dark:hover:bg-primary-300"
        >
          套用篩選
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref, watch, useId } from 'vue';

  /** 篩選條件的鍵名須與父頁面 filteredBills 讀取的鍵一致 */
  const emptyFilters = () => ({
    keyword: '',
    type: '',
    agency: '',
    scheduledSession: '',
    dateFrom: '',
    dateTo: '',
  });

  const props = defineProps({
    filters: { type: Object, default: () => ({}) },
    // 選項由父頁面依實際資料產生，避免與資料中的類型名稱不符
    typeOptions: { type: Array, default: () => [] },
    agencyOptions: { type: Array, default: () => [] },
  });

  const emit = defineEmits(['update:filters', 'reset-filters']);

  const panelId = useId();
  const isCollapsed = ref(true);
  const localFilters = ref({ ...emptyFilters(), ...pick(props.filters) });

  // 只取本元件管理的鍵，忽略父頁面附帶的其他狀態（例如 term）
  function pick(source) {
    const result = {};
    for (const key of Object.keys(emptyFilters())) {
      if (source?.[key] !== undefined) result[key] = source[key];
    }
    return result;
  }

  watch(
    () => props.filters,
    (newFilters) => {
      localFilters.value = { ...emptyFilters(), ...pick(newFilters) };
    },
    { deep: true },
  );

  const applyFilters = () => {
    emit('update:filters', { ...localFilters.value });
  };

  const clearFilters = () => {
    localFilters.value = emptyFilters();
    emit('reset-filters');
  };

  const labelClass = 'mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300';
  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500';
</script>
