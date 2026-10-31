<template>
  <header
    class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 print:hidden"
  >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和網站名稱 -->
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <!-- 標誌為裝飾用途（旁邊已有網站名稱），故 alt 留空；深色模式改用調亮的版本 -->
            <span class="shrink-0">
              <img src="/ntpuscs-logo.svg" alt="" class="h-9 w-auto dark:hidden" />
              <img src="/ntpuscs-logo-dark.svg" alt="" class="hidden h-9 w-auto dark:block" />
            </span>
            <span class="text-xl font-bold text-gray-900 dark:text-white">{{
              SITE_CONFIG.name
            }}</span>
          </NuxtLink>
        </div>

        <!-- 桌面版導覽選單 -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/bill"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            議案查詢
          </NuxtLink>
          <a
            :href="EXTERNAL_LINKS.committeeReports"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            委員會報告
          </a>
          <NuxtLink
            to="/secretariat"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            草擬系統
          </NuxtLink>
          <a
            :href="EXTERNAL_LINKS.mainWebsite"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            回到會網
          </a>
          <ThemeToggle />
        </nav>

        <!-- 行動版選單按鈕 -->
        <div class="md:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button
            type="button"
            :aria-label="mobileMenuOpen ? '關閉選單' : '開啟選單'"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="toggleMobileMenu"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 行動版選單 -->
      <div
        v-if="mobileMenuOpen"
        id="mobile-menu"
        class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
      >
        <nav class="flex flex-col space-y-3">
          <NuxtLink
            to="/bill"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
            @click="closeMobileMenu"
          >
            議案查詢
          </NuxtLink>

          <a
            :href="EXTERNAL_LINKS.committeeReports"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
          >
            委員會報告
          </a>
          <NuxtLink
            to="/secretariat"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
            @click="closeMobileMenu"
          >
            草擬系統
          </NuxtLink>
          <a
            :href="EXTERNAL_LINKS.mainWebsite"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
          >
            回到會網
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { SITE_CONFIG } from '#imports';
  import { ref } from 'vue';
  import ThemeToggle from '~/components/ThemeToggle.vue';

  const mobileMenuOpen = ref(false);

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };

  // 點擊外部關閉選單
  onMounted(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen.value && !event.target.closest('header')) {
        mobileMenuOpen.value = false;
      }
    };

    document.addEventListener('click', handleClickOutside);

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
  });
</script>
