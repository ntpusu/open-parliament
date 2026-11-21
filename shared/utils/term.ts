// shared/utils/term.ts

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
