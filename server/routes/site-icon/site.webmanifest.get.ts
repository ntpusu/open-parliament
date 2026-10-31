// server/routes/site-icon/site.webmanifest.get.ts
// 由伺服器產生 Web App Manifest，名稱直接取自 SITE_CONFIG，避免與網站其他處不一致
import { SITE_CONFIG } from '~~/shared/utils/constants';

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'application/manifest+json; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=86400');

  return JSON.stringify({
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    description: `${SITE_CONFIG.fullName}議事資訊網站`,
    lang: 'zh-Hant-TW',
    start_url: '/',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    icons: [
      { src: '/site-icon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/site-icon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  });
});
