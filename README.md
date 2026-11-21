# 「北大三峽議事資訊」網站 (Open Parliament: NTPUSCS)

## 專案簡介

「北大三峽議事資訊」網站是[國立臺北大學三峽校區學生議會](http://ntpusu.ntpu.edu.tw/s/ntpuscs)的第 2 代提案查詢網站，由第 26 屆秘書處開發。當初是因為學生自治會 WordPress 網站的一般權限帳號，若要使用 `<iFrame>` 嵌入第 1 代 AppSheet 版「已提議案查詢系統」，會被限制，才建置獨立查詢網站，以確保議事資訊的公開與流通。

### 當前狀態

**本站僅收錄第 23 屆至第 26 屆的議事資料，並僅保留最低限度維護**。自第 27 屆起，議長另行開發[議事服務系統](https://ntpuscs.github.io/Parliamentspage/)（原始碼：[ntpuscs/Parliamentspage](https://github.com/ntpuscs/Parliamentspage)），議案資料改於該處公開。

傳統查詢介面（`/bill/classical`）所嵌入之 AppSheet 仍含有第 27 屆以後之資料，惟不另行清理，僅於該頁以文字說明其不在本站收錄範圍內。原供秘書處草擬議程與會議紀錄之草擬系統（`/secretariat`），因第 27 屆起議事改由議事服務系統處理，已一併下架。

### 系統功能

- **基礎介面與瀏覽體驗**
  - 區塊化首頁設計，提供主要服務之快速連結。
  - 具備夜間模式 (Dark Mode) 切換功能的頭部導覽列。
  - 底部頁腳包含單位名稱及開源儲存庫連結。
- **議案查詢系統** (`/bill`)
  - 屆次議案列表：可顯示第 23 至 26 屆中特定屆次的所有議案。
  - 單一議案顯示 (`/bill/:term/:number`)：提供單一議案的完整資訊、附件連結，並支援列印排版。

## 技術架構

本系統使用以下現代化的技術組合：

- **框架**：Nuxt 4
- **樣式**：Tailwind CSS
- **圖示庫**：Heroicons
- **資料來源**：另於 [ntpusu/legislative-data](https://github.com/ntpusu/legislative-data) 儲存
- **部署環境**：Cloudflare Pages [![Powered by Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange?logo=cloudflare)](https://pages.cloudflare.com/)

- **套件管理**：pnpm (Node.js 環境)
- **版本控制**：Git / GitHub

收錄範圍定義於 `shared/utils/term.ts` 之 `EARLIEST_TERM`、`LATEST_TERM`。

## 授權與聯絡資訊

- **維護單位**：國立臺北大學三峽校區學生議會
- **專案授權**：本專案開放原始碼，依據 [MIT License](LICENSE) 條款發布。歡迎各學生自治組織改作。
