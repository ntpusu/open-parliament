// server/api/secretariat/auth.post.ts
// 秘書處草擬系統的授權碼驗證。
// 注意：目前登入狀態僅記錄於前端 sessionStorage，此端點只負責比對授權碼。

export default defineEventHandler(async (event) => {
  const correctPassword = process.env.SEC_PASSWORD;

  // 未設定授權碼時一律拒絕。否則請求不帶 password 時，
  // undefined === undefined 會被當成驗證成功。
  if (!correctPassword) {
    console.error('[secretariat/auth] 未設定 SEC_PASSWORD，已拒絕登入請求。');
    setResponseStatus(event, 503);
    return { authenticated: false, message: '系統尚未設定授權碼，請聯絡資訊人員。' };
  }

  // 請求體可能為空或格式錯誤，此時視為未提供授權碼
  const body = await readBody<{ password?: unknown }>(event).catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (password && timingSafeEqual(password, correctPassword)) {
    return { authenticated: true, message: '驗證成功！' };
  }

  // 為了安全，不明確指出錯誤原因
  setResponseStatus(event, 401);
  return { authenticated: false, message: '驗證失敗，請檢查授權碼。' };
});

/**
 * 以固定時間比對兩個字串，避免從回應時間推測授權碼內容。
 * 不使用 node:crypto，以便在 Cloudflare Workers 等環境執行。
 */
function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  const length = Math.max(x.length, y.length);
  let diff = x.length ^ y.length;
  for (let i = 0; i < length; i++) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
}
