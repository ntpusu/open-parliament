# 技術指示

## 開發環境建置

本指南適用於接手維護之資訊人員。

### 1. 取得專案與依賴安裝

```bash
git clone https://github.com/ntpusu/open-parliament.git
cd open-parliament
pnpm install

```

### 2. 啟動開發伺服器

```bash
pnpm dev

```

啟動後，可於瀏覽器開啟 `http://localhost:3000` 預覽。

## 部署與上線

推薦使用 Cloudflare Pages 進行自動化部署：

1. 將本儲存庫連結至 Cloudflare Pages。
2. 於 Cloudflare 的部署設定中，填入 `.env.example` 內對應的環境變數 。
3. 設定自訂網域，Cloudflare 將自動核發 SSL 憑證確保連線安全；若要使用 ntpusu.org 的子網域，請將所需子網域告知委外人員。
