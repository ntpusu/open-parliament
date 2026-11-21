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
 * 注意：此為依日期推算之「實際」屆次，可能大於本站收錄之 LATEST_TERM；
 * 判斷資料範圍時請改用 isValidTerm() / getValidTerms()。
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
 * 本站收錄之最早屆次：第 23 屆是第一屆開始有系統性地使用議案系統者。
 */
export const EARLIEST_TERM = 23;

/**
 * 本站收錄之最後屆次：自第 27 屆起，議案資料改由學生議會議長另行開發之
 * 議事服務系統公開，本站不再收錄。
 */
export const LATEST_TERM = 26;

/** 判斷某屆次是否在本站收錄範圍（第 23 至 26 屆）內 */
export const isValidTerm = (term: unknown): term is number =>
  typeof term === 'number' &&
  Number.isInteger(term) &&
  term >= EARLIEST_TERM &&
  term <= LATEST_TERM;

/**
 * 取得本站收錄之所有屆次，最新屆次排在最前面（降冪）。
 */
export const getValidTerms = (): number[] => {
  const validTerms: number[] = [];
  for (let term = LATEST_TERM; term >= EARLIEST_TERM; term--) {
    validTerms.push(term);
  }
  return validTerms;
};

// 取得最早收錄屆次
export const getEarliestTerm = (): number => EARLIEST_TERM;

// 取得最後收錄屆次
export const getLatestTerm = (): number => LATEST_TERM;
