// server/api/bills/index.get.ts
// 支援 Query: ?term=26, ?limit=10, ?type=all
// 本站僅收錄第 23 至 26 屆議案，超出範圍的屆次一律回傳空陣列
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const billService = useBillService();

  let results: any[];

  // 如果有指定 term（且未指定 type=all），則回傳該屆次的議案
  if (query.type !== 'all' && query.term) {
    const termNumber = parseInt(query.term as string, 10);
    results = await billService.getBillsByTerm(termNumber);
  }

  // 否則回傳本站收錄之全部議案
  else {
    results = await billService.getAllBills();
  }

  // 支援 limit 限制筆數 (預設供首頁最新 10 筆使用)
  // 時間戳記最新的在後面，故 slice 最後 limit 筆，然後 reverse 讓最新的在前面
  if (query.limit) {
    const limit = parseInt(query.limit as string, 10);
    results = results.slice(-limit).reverse();
  }

  return results;
});
