// app/middleware/auth.ts
// 秘書處草擬系統的前端登入檢查。
// 登入狀態目前只記錄於 sessionStorage，伺服器端渲染時無法讀取，因此只在客戶端檢查。

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return;

  const isAuthenticated = sessionStorage.getItem('secretariat_authenticated') === 'true';
  if (isAuthenticated) return;

  // 未驗證則導向登入頁，並帶上原目標路徑，登入後可返回
  return navigateTo({ path: '/secretariat/login', query: { redirect: to.fullPath } });
});
