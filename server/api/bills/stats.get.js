// server/api/bills/stats.get.js
// 首頁統計資訊：總議案數、目前屆次、本屆議案數，以及各屆議案數與議案類型分布
import { getCurrentTerm, getEarliestTerm } from '~~/shared/utils/term';

const UNCATEGORIZED = '未分類';

export default defineEventHandler(async (event) => {
  const currentTerm = getCurrentTerm();

  // useBillService 內部已處理 CDN 失敗並拋出 H3 錯誤，這裡不需重複包裝
  const allBills = await useBillService().getAllBills();

  const countByTerm = new Map();
  const countByType = new Map();

  for (const bill of allBills) {
    if (typeof bill.term === 'number') {
      countByTerm.set(bill.term, (countByTerm.get(bill.term) ?? 0) + 1);
    }
    const type = bill.billType?.trim() || UNCATEGORIZED;
    countByType.set(type, (countByType.get(type) ?? 0) + 1);
  }

  // 各屆議案數：補齊無議案的屆次為 0，避免圖表出現斷層
  const byTerm = [];
  for (let term = getEarliestTerm(); term <= currentTerm; term++) {
    byTerm.push({ term, count: countByTerm.get(term) ?? 0 });
  }

  // 議案類型分布：件數多者在前，件數相同則依名稱排序以維持穩定順序
  const byType = [...countByType]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type, 'zh-Hant'));

  // 統計數字變動緩慢，允許瀏覽器與 CDN 快取 5 分鐘，避免首頁每次載入都重抓兩份 JSON
  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=300');

  return {
    data: {
      totalBills: allBills.length,
      currentTerm,
      // 本屆議案：換屆過渡期若最新資料檔仍為舊屆，則自然為 0，與 getBillsByTerm 行為一致
      thisTermBills: countByTerm.get(currentTerm) ?? 0,
      byTerm,
      byType,
    },
    message: 'Statistics fetched successfully',
  };
});
