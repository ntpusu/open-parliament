import { EXTERNAL_LINKS, SITE_CONFIG } from './shared/utils/constants';

export default defineNuxtConfig({
  compatibilityDate: '2026-02-26',
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  ssr: true, // 確保開啟 SSR
  nitro: {
    preset: 'cloudflare-pages',
  },
  app: {
    head: {
      title: SITE_CONFIG.name,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: `${SITE_CONFIG.fullName}議事資訊網站` },
      ],
      link: [
        // 不支援 SVG 的瀏覽器使用 favicon.ico；其餘使用可隨深色主題調色的 favicon.svg
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/site-icon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site-icon/site.webmanifest' },
      ],
    },
  },
  routeRules: {
    '/committee-reports': {
      redirect: {
        to: EXTERNAL_LINKS.committeeReports,
        statusCode: 301,
      },
    },
  },
});
