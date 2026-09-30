// composables/useSecretariat.ts
import { ref, watch } from 'vue';
import { useAsyncData } from '#app';
import { getCurrentTerm } from '~~/shared/utils/term';
import type { Bill } from '~~/shared/types/bill';

/**
 * 將阿拉伯數字轉換為中文數字
 * @param num 阿拉伯數字
 * @returns 中文數字字串
 */
function toChineseNumeral(num: number): string {
  const chineseNumerals = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num >= 0 && num <= 10) return chineseNumerals[num] ?? num.toString();
  if (num > 10 && num < 20) return '十' + (num % 10 === 0 ? '' : chineseNumerals[num % 10]);
  // 對於大於20的數字簡單處理，如果超出範圍，直接返回數字字串
  return num.toString();
}

/**
 * 將文字中的 HTML 特殊字元轉義，避免破壞輸出的 HTML 結構。
 * @param text 原始文字
 * @returns 轉義後的文字
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 將文字中的換行轉換為 HTML 的 <br> 標籤。
 * @param text 原始文字
 * @returns 以 <br> 分隔的文字
 */
function toHtmlLineBreaks(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, '<br>');
}

export function useSecretariat() {
  const currentTerm = getCurrentTerm();
  const bills = ref<Bill[]>([]); // 儲存從 API 獲取的議案資料
  const error = ref<string | null>(null);

  const {
    pending: isLoading,
    data: asyncData,
    error: asyncError,
    refresh: fetchBills,
  } = useAsyncData<Bill[]>(`bills-term-${currentTerm}`, async () => {
    if (!currentTerm) {
      throw new Error('無法獲取當前屆期，請稍後再試。');
    }

    const data = await $fetch<Bill[]>(`/api/bills/?term=${currentTerm}`);

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('API 回應資料格式不正確或無議案資料。');
    }

    return data.filter((bill) => bill.billNumber);
  });

  // 將 asyncData 同步到 bills ref
  watch(
    asyncData,
    (val) => {
      if (val) bills.value = val;
    },
    { immediate: true },
  );
  // 將 asyncError 同步到 error ref
  watch(
    asyncError,
    (val) => {
      if (val) error.value = val.message;
    },
    { immediate: true },
  );

  const generateAgenda = (reportItems: string, discussionItems: string): string => {
    if (!bills.value.length) return '請確保已載入議案資料。';

    // 產生「（一）（二）…」形式的議程項目。
    // allowPlainText 為 true 時，非編號的輸入會被當作純文字直接輸出（並做 HTML 轉義）。
    const buildItems = (input: string, allowPlainText: boolean): string[] => {
      const items: string[] = [];
      let index = 0;

      input
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .forEach((token) => {
          const isSerialNumber = /^\d+$/.test(token);
          // 討論事項只接受編號，非編號的內容直接略過。
          if (!isSerialNumber && !allowPlainText) return;

          index += 1;
          const numeral = toChineseNumeral(index);

          if (isSerialNumber) {
            const num = parseInt(token, 10);
            const bill = bills.value.find((b) => b.serialNumber === num);
            items.push(
              bill
                ? `（${numeral}）審查${bill.term}屆北大峽議字第${bill.serialNumber}號【${bill.subject}】。`
                : `（${numeral}）無法找到${currentTerm}屆北大峽議字第${num}號議案。`,
            );
          } else {
            items.push(`（${numeral}）${escapeHtml(token)}`);
          }
        });

      return items;
    };

    const reportItemLines = buildItems(reportItems, true);
    const discussionItemLines = buildItems(discussionItems, false);

    return [
      '一、開會。',
      '二、主席致詞。',
      '三、確認議程。',
      '四、報告事項：',
      ...reportItemLines,
      '五、問答時段。',
      '六、討論事項：',
      ...discussionItemLines,
      '七、會務質詢。',
      '八、臨時動議。',
      '九、散會。',
    ].join('\n');
  };

  const generateMinutes = (orderString: string): string => {
    if (!orderString || !bills.value.length)
      return '請輸入有效的議案編號順序，並確保已載入議案資料。';
    return orderString
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))
      .map((num, index) => {
        const bill = bills.value.find((b) => b.serialNumber === num);
        if (bill) {
          return (
            [
              `<h4 class="as-proposal-serial-number">第${toChineseNumeral(index + 1)}案</h4>`,
              `<p>編號：${bill.term}屆北大峽議字第${bill.serialNumber}號</p>`,
              `<p>案由：${escapeHtml(bill.subject)}</p>`,
              `<p>說明：<br>${toHtmlLineBreaks(bill.description)}</p>`,
              `<p>辦法：${escapeHtml(bill.proposedAction)}</p>`,
              `<p>附件：詳見<a href="https://ntpu-parliament.pages.dev/bill/${bill.term}/${bill.serialNumber}">已提案件查詢系統</a></p>`,
              `<p>決議：<br />　一、經提案者說明、本會議員詢答完畢。<br />　二、議員提案包裹表決，議員附議，通過。<br />　三、全案，同意票票，不同意票0票，通過。</p>`,
            ].join('\n\n') + '\n\n'
          );
        }
        return `<h4 class="as-proposal-serial-number">第${toChineseNumeral(index + 1)}案</h4>\n\n<p>無法找到${currentTerm}屆北大峽議字第${num}號議案的資料。</p>\n\n`;
      })
      .join('');
  };

  return { bills, currentTerm, isLoading, error, fetchBills, generateAgenda, generateMinutes };
}
