export const APP_NAME = "독거노인 안전 관리 시스템";
export const APP_NAME_SHORT = "독거노인 안전\n관리 시스템";
export const APP_SUBTITLE = "Senior Safety Monitoring";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ALERT_LIST: "/alert-list",
  SENIORS: "/seniors",
  HISTORY: "/history",
  MONITORING: "/monitoring",
  LOGS: "/logs",
  SETTINGS: "/settings",
} as const;

export const SEVERITY_LABEL: Record<string, string> = {
  high: "상",
  mid: "중",
  low: "하",
};

export const LOG_TYPE_LABEL: Record<string, string> = {
  query: "조회",
  action: "처리",
  system: "시스템",
  login: "로그인",
};

export const DISTRICT_OPTIONS = ["전체", "종로구", "중구", "성동구", "마포구", "강북구"];
export const SEVERITY_OPTIONS = ["중증정도: 전체", "상", "중", "하"];
export const PROCESS_STATUS_OPTIONS = ["확인완료", "확인요망 유지", "응급 이관"];
export const WAKE_WINDOW_OPTIONS = [
  "05:00 ~ 10:00 (기본)",
  "06:00 ~ 11:00",
  "04:00 ~ 09:00",
];
