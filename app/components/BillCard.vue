<template>
  <NuxtLink
    :to="
      bill.billNumber !== ''
        ? `/bill/${bill.term}/${bill.serialNumber}`
        : `/bill/unnumbered/${bill.rowIndex}`
    "
  >
    <div
      class="bill-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {{ bill.subject }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{ bill.billNumber !== '' ? bill.billNumber : `${bill.term}屆，尚未編號` }}
      </p>
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          {{ bill.billType }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ bill.submittedAt }}
        </span>
      </div>
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <p><strong>提案者：</strong>{{ formatProposer(bill) }}</p>
      </div>
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <p v-if="bill.scheduledSession"><strong>排入會議：</strong>{{ bill.scheduledSession }}</p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
  defineProps({
    bill: {
      type: Object,
      required: true,
    },
  });
</script>

<style scoped>
  .bill-card {
    transition: all 0.3s ease;
  }

  .bill-card:hover {
    transform: translateY(-2px);
  }
</style>
