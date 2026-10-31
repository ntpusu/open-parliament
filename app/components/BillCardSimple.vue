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
      <p class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {{ bill.subject }}
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {{
          bill.billNumber !== ''
            ? '第' + bill.billNumber.replace(/北大峽議字/, '')
            : '（本件秘書處尚未編號）'
        }}
      </p>
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <p><strong>提案者：</strong>{{ formatProposer(bill) }}</p>
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
