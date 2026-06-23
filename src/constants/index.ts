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

/** ERD SENIOR.status 전체 값 */
export const SENIOR_STATUS_OPTIONS = ["정상", "확인요망", "확인완료", "확인요망유지", "응급호출"] as const;

/** ERD CONTACT_HISTORY.result_status */
export const PROCESS_STATUS_OPTIONS = ["확인완료", "확인요망유지", "응급호출"] as const;

/** 관할구역 — 시/도 (현재 서울만 운영) */
export const CITY_OPTIONS = ["전체", "서울"] as const;

/** 관할구역 — 구/군 */
export const GU_OPTIONS = [
  "전체", "종로구", "중구", "성동구", "마포구", "강북구", "노원구",
  "도봉구", "성북구", "중랑구", "동대문구", "광진구",
] as const;

/** 관할구역 — 동 (구별 매핑) */
export const DONG_BY_GU: Record<string, string[]> = {
  노원구: ["전체", "상계동", "월계동", "공릉동", "하계동", "중계동"],
  도봉구: ["전체", "쌍문동", "방학동", "창동", "도봉동"],
  강북구: ["전체", "미아동", "번동", "수유동", "인수동", "우이동"],
  성북구: ["전체", "길음동", "하월곡동", "종암동", "정릉동", "돈암동"],
  중랑구: ["전체", "면목동", "상봉동", "묵동", "신내동", "망우동"],
  동대문구: ["전체", "회기동", "이문동", "장안동", "전농동"],
  광진구: ["전체", "중곡동", "군자동", "화양동", "자양동"],
  성동구: ["전체", "마장동", "행당동", "금호동", "응봉동", "사근동", "옥수동", "왕십리동"],
};

/** @deprecated GU_OPTIONS 사용 권장 */
export const DISTRICT_OPTIONS = ["전체", ...GU_OPTIONS.slice(1)];

export const SEVERITY_OPTIONS = ["중증정도: 전체", "상", "중", "하"];

export const WAKE_WINDOW_OPTIONS = [
  "05:00 ~ 10:00 (기본)",
  "06:00 ~ 11:00",
  "04:00 ~ 09:00",
];
