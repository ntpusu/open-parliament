// shared/utils/term.ts

/**
 * 取得某時間點在臺北時區的年與月。
 * 伺服器（Cloudflare）以 UTC 執行，若直接用 getFullYear()/getMonth()，
 * 7 月 1 日 00:00–08:00（臺北時間）之間伺服器與瀏覽器會算出不同屆次。
 */
const getTaipeiYearMonth = (date: Date): { year: number; month: number } => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(date);
  const pick = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: pick('year'), month: pick('month') };
};

/**
 * 取得當前（最新）屆次
 * 判斷邏輯：每年 7 月 1 日到隔年 6 月 30 日為一屆（以臺北時間為準）。
 * 範例：2025年7月1日～2026年6月30日為第26屆。
 * @param now 計算基準時間，預設為現在（主要供測試使用）
 */
export const getCurrentTerm = (now: Date = new Date()): number => {
  const { year, month } = getTaipeiYearMonth(now);

  // 如果月份小於 7 (1月~6月)，則屬於「前一年」開始的屆次
  const baseYear = month < 7 ? year - 1 : year;

  // 國立臺北大學係 2000 年 2 月成立，故學生自治會屆次以 2000 年為基準年（第 1 屆），因此計算方式為 (baseYear - 1999)。
  return baseYear - 1999;
};

/**
 * 取得所有有效屆次區間陣列
 * 需求：有效屆次為 23 屆以後到最新屆次，因為 23 屆是第一屆開始有系統性地使用議案系統者。
 */
export const getValidTerms = (): number[] => {
  const currentTerm = getCurrentTerm();
  const validTerms: number[] = [];

  for (let term = 23; term <= currentTerm; term++) {
    validTerms.push(term);
  }

  // 習慣上會將最新屆次排在最前面 (降冪)
  return validTerms.reverse();
};

// 取得最早有效屆次
export const getEarliestTerm = (): number => {
  return 23;
};

/**
 * 檢查給定的議案陣列是否確實屬於當前屆次。
 * 場景：換屆時 bill_latestTerm.json 尚未更新，資料 term 仍為舊屆，
 * 但 getCurrentTerm() 已回傳新屆次，此時應回傳 false。
 *
 * @param bills  議案陣列
 * @returns      若任一個 bill.term === getCurrentTerm() 則為 true
 */
export const isCurrentTermBills = (bills: { term?: number | null }[]): boolean => {
  const currentTerm = getCurrentTerm();
  return bills.some((bill) => bill.term === currentTerm);
};
