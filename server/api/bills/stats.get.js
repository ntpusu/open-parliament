// server/api/bills/stats.get.ts
// 首頁統計資訊：總議案數、目前屆次、本屆議案數
import { getCurrentTerm } from '~~/shared/utils/term';

export default defineEventHandler(async (event) => {
  const currentTerm = getCurrentTerm();

  // useBillService 內部已處理 CDN 失敗並拋出 H3 錯誤，這裡不需重複包裝
  const allBills = await useBillService().getAllBills();

  // 本屆議案：換屆過渡期若最新資料檔仍為舊屆，則自然為 0，與 getBillsByTerm 行為一致
  const thisTermBills = allBills.filter((bill) => bill.term === currentTerm).length;

  // 統計數字變動緩慢，允許瀏覽器與 CDN 快取 5 分鐘，避免首頁每次載入都重抓兩份 JSON
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300');

  return {
    data: {
      totalBills: allBills.length,
      currentTerm,
      thisTermBills,
    },
    message: 'Statistics fetched successfully',
  };
});
