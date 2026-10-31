// shared/utils/constants.ts
// 網站與組織的共用常數。放在 shared/ 讓前端、伺服器與 nuxt.config 都能使用。

// 網站基本設定
export const SITE_CONFIG = {
  name: '北大三峽議事資訊',
  fullName: '國立臺北大學三峽校區學生議會',
  englishName: 'NTPU Student Parliament (Sanxia Campus)',
  domain: 'sxcongress.ntpusu.org',
  email: 'ntpuscs@gm.ntpu.edu.tw',
  githubRepo: 'https://github.com/ntpusu/open-parliament',
};

// 本組織之資料
export const ORG_DATA = {
  nameZhFull: '國立臺北大學三峽校區學生議會',
  nameZhShort: '北大三峽議會',
  nameEnFull: 'NTPU Student Parliament (Sanxia Campus)',
  nameEnShort: 'NTPUSCS',
  email: 'ntpuscs@gmail.com',
  office: '圖書資訊大樓 B1F10 室',
  meetingRoom: '圖書資訊大樓 B1F10 室',
};

// 外部連結設定
export const EXTERNAL_LINKS = {
  mainWebsite: 'https://ntpusu.ntpu.edu.tw/p/412-1015-175.php?Lang=zh-tw',
  // 委員會報告已移至學生會網站；本站 /committee-reports 亦以 routeRules 導向此處
  committeeReports: 'https://ntpusu.ntpu.edu.tw/p/412-1015-245.php?Lang=zh-tw',
};
