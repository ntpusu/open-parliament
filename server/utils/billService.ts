// server/utils/billService.ts
import type { Bill, BillResponse } from '~~/shared/types/bill';
import { isValidTerm } from '~~/shared/utils/term';

export const useBillService = () => {
  const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/ntpusu/legislative-data@main/data';

  // 以 Nitro 內建的 $fetch 存取遠端資料
  const readJsonFile = async (filename: string): Promise<BillResponse> => {
    try {
      // 透過 CDN 讀取資料，並加入超時與重試機制確保在 Cloudflare Pages 等環境穩定執行
      const data = await $fetch<BillResponse>(`${CDN_BASE_URL}/${filename}`, {
        retry: 3,
        retryDelay: 1000,
        timeout: 5000,
      });

      if (!data) {
        throw new Error('Empty data received from CDN');
      }

      // $fetch 讀取 JSON 會自動 parse，直接斷言型別即可
      return data as BillResponse;
    } catch (error) {
      // 錯誤拋出，並額外紀錄錯誤原因方便維護
      console.error(`[CDN Fetch Error] ${filename}:`, error);
      throw createError({
        statusCode: 500,
        statusMessage: `無法從遠端取得議案資料檔案 ${filename} !`,
      });
    }
  };

  // 取得本站收錄（第 23 至 26 屆）之所有議案。
  // 第 23 至 26 屆的議案均已歸檔於 bill_pastTerms.json；bill_latestTerm.json 自第 27 屆起
  // 存放的是改由新議事服務系統管理的屆次，本站不再讀取。仍依屆次過濾，以免日後換屆時
  // 第 27 屆以後的資料被併入 bill_pastTerms.json 而出現在本站。
  const getAllBills = async (): Promise<Bill[]> => {
    const res = await readJsonFile('bill_pastTerms.json');
    return res.data.filter((bill) => isValidTerm(bill.term));
  };

  // 取得特定屆次的所有議案
  const getBillsByTerm = async (targetTerm: number): Promise<Bill[]> => {
    if (!isValidTerm(targetTerm)) {
      return [];
    }
    const bills = await getAllBills();
    return bills.filter((bill) => bill.term === targetTerm);
  };

  // 依議案總流水號（rowIndex）取得單一議案
  const getBillByRowIndex = async (targetRowIndex: number): Promise<Bill | undefined> => {
    const bills = await getAllBills();
    return bills.find((bill) => bill.rowIndex === targetRowIndex);
  };

  // 由屆次 + 流水號取得單一特定議案
  const getBillById = async (
    targetTerm: number,
    targetSerialNumber: number,
  ): Promise<Bill | undefined> => {
    if (!isValidTerm(targetTerm)) {
      return undefined;
    }
    const bills = await getAllBills();
    return bills.find(
      (bill) => bill.term === targetTerm && bill.serialNumber === targetSerialNumber,
    );
  };

  return {
    getAllBills,
    getBillsByTerm,
    getBillByRowIndex,
    getBillById,
  };
};
